// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

// Import enumerable set
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract KeyStream is Ownable, ReentrancyGuard {

    event EnabledRenting(address indexed seller);
    event DisabledRenting(address indexed seller);

    event OpenedRentRequest(uint indexed requestId, address indexed borrower, address indexed seller);
    event ClosedRentRequest(uint indexed requestId, address indexed borrower, address indexed seller);

    event FulfilledRentRequest(uint indexed requestId, address indexed borrower, address indexed seller);
    event RejectedRentRequest(uint indexed requestId, address indexed borrower, address indexed seller);

    using EnumerableSet for EnumerableSet.AddressSet;
    using ECDSA for bytes32;

    uint constant FEE_BASE = 10000;

    mapping(address => int) private _balance;

    mapping(address => uint256) private rentFee;
    EnumerableSet.AddressSet private _available;

    uint numRequests = 1; // Start at 1 so that 0 can represent the NULL request

    struct Request {
        uint requestId;
        address seller;
        bytes pubkey;
        uint fulfilledAt;
        bytes encryptedAuth;
    }

    mapping(address => Request) private openRequest;
    mapping(uint => address) private ownerOfRequest;
    mapping(address => uint) private filledRequest;

    constructor() {}

    // ---------------------
    //       BALANCES
    // ---------------------

    function accumulatedFees(address seller) internal view returns (uint) {
        uint sellerFee = rentFee[seller];
        address borrower = ownerOfRequest[filledRequest[seller]];
        uint dt = block.timestamp - openRequest[borrower].fulfilledAt;
        dt = dt < 3600 ? 3600 : dt;
        // Minimum 1 hour

        uint price = dt * sellerFee * (1 trx) / (3600 * FEE_BASE);
        return price;
    }

    function availableBalance(address user) public view returns (uint) {
        int balance = int(_balance[user]);
        if (openRequest[user].requestId != 0) {
            uint sellerFee = rentFee[openRequest[user].seller];
            balance -= int(24 * (1 trx) * sellerFee / FEE_BASE);
        }
        if (filledRequest[user] != 0) {
            int accumFees = int(accumulatedFees(user));
            balance += accumFees;
        }
        assert(balance >= 0);
        return uint(balance);
    }

    function deposit() public payable nonReentrant {
        require(msg.value > 0, "ZERO_DEPOSIT");
        _balance[msg.sender] += int(msg.value);
    }

    function withdraw(int amt) public nonReentrant {
        require(amt > 0, "POSITIVE_WITHDRAWAL_REQUIRED");
        require(amt <= int(availableBalance(msg.sender)), "INSUFFICIENT_BALANCE");
        _balance[msg.sender] -= amt;
    }

    // ----------------------------------------
    //       FINDING AVAILABLE TO RENT
    // ----------------------------------------

    function numAvailableToRent() public view returns (uint) {
        return _available.length();
    }

    function getAvailableToRent(uint index) public view returns (address) {
        require(index < _available.length(), "INDEX_NOT_IN_RANGE");
        return _available.at(index);
    }

    function nextAvailableToRent() public view returns (address) {
        return getAvailableToRent(0);
    }

    function isAvailable(address seller) public view returns (bool) {
        if (rentFee[seller] == 0) return false;
        if (_available.contains(seller)) return true;
        if (filledRequest[seller] == 0) return false;
        address borrower = ownerOfRequest[filledRequest[seller]];
        if (openRequest[borrower].fulfilledAt + 24 * 60 * 60 < block.timestamp) return true;
        return false;
    }

    // ----------------------------------------
    //       SELLER FUNCTIONALITY
    // ----------------------------------------

    // Marks a user as offering their login
    function enableRent(uint256 fee) public nonReentrant {
        address seller = msg.sender;
        require(fee != 0, "REQUIRES_NONZERO_FEE");
        require(rentFee[seller] != fee, "ALREADY_ENABLED");
        rentFee[seller] = fee;

        _available.add(seller);

        emit EnabledRenting(seller);
    }

    // Marks a user as no longer offering their login
    function disableRent() public nonReentrant {
        address seller = msg.sender;

        require(rentFee[seller] == 0, "ALREADY_DISABLED");
        require(isAvailable(seller), "AUTH_IN_USE");

        rentFee[seller] = 0;
        _available.remove(seller);

        emit DisabledRenting(seller);
    }

    // ----------------------------------------
    //       SELLER SERVER FUNCTIONALITY
    // ----------------------------------------

    function rejectRentRequest(
        bytes32 hash, // Signature hash from the seller (used in place of msg.sender to allow a server to fulfill requests)
        bytes memory signature, // Signature
        uint reqId
    ) public nonReentrant {
        address seller = hash.toEthSignedMessageHash().recover(signature);
        require(seller != address(0), "INVALID_SIGNATURE");

        require(reqId < numRequests, "INVALID_REQUEST_ID");
        address borrower = ownerOfRequest[reqId];
        require(openRequest[borrower].requestId == reqId, "REQUEST_NOT_ACTIVE");
        require(openRequest[borrower].seller == seller, "NOT_CORRECT_SELLER");

        _closeRentRequest(reqId);
        emit RejectedRentRequest(reqId, borrower, seller);
    }

    function fulfillRentRequest(
        bytes32 hash, // Signature hash from the seller (used in place of msg.sender to allow a server to fulfill requests)
        bytes memory signature, // Signature
        uint reqId,
        bytes memory encryptedAuth
    ) public nonReentrant {
        address seller = hash.toEthSignedMessageHash().recover(signature);
        require(seller != address(0), "INVALID_SIGNATURE");

        require(reqId < numRequests, "INVALID_REQUEST_ID");
        address borrower = ownerOfRequest[reqId];
        require(openRequest[borrower].requestId == reqId, "REQUEST_NOT_ACTIVE");
        require(openRequest[borrower].seller == seller, "NOT_CORRECT_SELLER");
        require(openRequest[borrower].fulfilledAt == 0, "ALREADY_FULFILLEd");

        openRequest[borrower].fulfilledAt = block.timestamp;
        openRequest[borrower].encryptedAuth = encryptedAuth;
        filledRequest[seller] = reqId;

        emit FulfilledRentRequest(reqId, borrower, seller);
    }

    // ----------------------------------------
    //       BUYER FUNCTIONALITY
    // ----------------------------------------

    function _openRentRequest(address seller, bytes memory pubkey) internal returns (uint) {
        require(rentFee[seller] != 0, "NOT_A_SELLER");
        require(isAvailable(seller), "ALREADY_RENTED");

        uint sellerFee = rentFee[seller];
        uint minBalance = sellerFee * 24 * (1 trx) / FEE_BASE;
        address borrower = msg.sender;
        require(availableBalance(borrower) >= minBalance, "INSUFFICIENT_BALANCE");

        uint reqId = numRequests++;

        openRequest[borrower].requestId = reqId;
        openRequest[borrower].seller = seller;
        openRequest[borrower].pubkey = pubkey;
        openRequest[borrower].fulfilledAt = 0;
        openRequest[borrower].encryptedAuth = "";

        ownerOfRequest[reqId] = borrower;

        _available.remove(seller);
        return reqId;
    }

    function openRentRequest(address seller, bytes memory pubkey) public nonReentrant returns (uint) {
        require(openRequest[msg.sender].seller == address(0), "EXISTING_OPEN_REQUEST");

        uint reqId = _openRentRequest(seller, pubkey);

        emit OpenedRentRequest(reqId, msg.sender, seller);
        return reqId;
    }

    function _closeRentRequest(uint reqId) internal {
        address borrower = ownerOfRequest[reqId];

        address seller = openRequest[borrower].seller;
        _available.add(seller);
        filledRequest[seller] = 0;

        if (openRequest[borrower].fulfilledAt > 0) {
            int price = int(accumulatedFees(seller));
            _balance[borrower] -= price;
            _balance[seller] += price;
        }

        openRequest[borrower].requestId = 0;
        openRequest[borrower].seller = address(0);
        openRequest[borrower].pubkey = "";
        openRequest[borrower].fulfilledAt = 0;
        openRequest[borrower].encryptedAuth = "";
    }

    function endRent(uint reqId) public nonReentrant {
        require(reqId < numRequests, "INVALID_REQUEST_ID");
        require(ownerOfRequest[reqId] == msg.sender, "NOT_OWNER_OF_REQUEST");

        require(openRequest[msg.sender].requestId == reqId, "REQUEST_NOT_ACTIVE");
        address seller = openRequest[msg.sender].seller;

        _closeRentRequest(reqId);

        emit ClosedRentRequest(reqId, msg.sender, seller);
    }

    function getEncryptedAuth(
        address borrower
    ) public view returns (bytes memory) {
        require(openRequest[borrower].requestId != 0, "NO_OPEN_REQUESTS");
        if (
            openRequest[borrower].fulfilledAt == 0 ||
            block.timestamp > openRequest[borrower].fulfilledAt + 24 * 60 * 60
        ) return "";
        return openRequest[borrower].encryptedAuth;
    }

}
