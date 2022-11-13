// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

// Import enumerable set
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract KeyStream is Ownable, ReentrancyGuard {

    event OpenedRentRequest(address indexed borrower, uint fee);
    event ClosedRentRequest(address indexed borrower);

    event FulfilledRentRequest(address indexed borrower, address indexed seller);

    using EnumerableSet for EnumerableSet.AddressSet;
    using ECDSA for bytes32;

    uint constant FEE_BASE = 10000;

    mapping(address => int) private _balance;

    EnumerableSet.AddressSet private _openRequests;

    struct Request {
        // Set by the borrower
        uint fee;
        address borrower;
        bytes pubkey;
        // Set by the seller
        address seller;
        uint fulfilledAt;
        bytes encryptedAuth;
    }

    mapping(address => Request) private request;
    mapping(address => address) private filledRequest;

    constructor() {}

    // ---------------------
    //       BALANCES
    // ---------------------

    function accumulatedFees(address seller) internal view returns (uint) {
        address borrower = filledRequest[seller];
        uint fee = request[filledRequest[seller]].fee;
        require(fee != 0, "INVALID_BORROWER");

        uint dt = block.timestamp - request[borrower].fulfilledAt;
        dt = dt < 3600 ? 3600 : dt;
        // Minimum 1 hour

        uint price = dt * fee * (1 trx) / (3600 * FEE_BASE);
        return price;
    }

    function availableBalance(address user) public view returns (uint) {
        int balance = int(_balance[user]);
        if (request[user].fee != 0) {
            uint fee = request[user].fee;
            balance -= int(24 * (1 trx) * fee / FEE_BASE);
        }
        if (filledRequest[user] != address(0)) {
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
    //       FINDING OPEN REQUESTS
    // ----------------------------------------

    function numOpenRequests() public view returns (uint) {
        return _openRequests.length();
    }

    function getRequest(uint index) public view returns (address) {
        require(index < _openRequests.length(), "INDEX_NOT_IN_RANGE");
        return _openRequests.at(index);
    }

    function nextOpenRequest() public view returns (address) {
        return getRequest(0);
    }

    function isAvailable(address seller) public view returns (bool) {
        address borrower = filledRequest[seller];
        if (borrower == address(0)) return true;
        if (request[borrower].fulfilledAt + 24 * 60 * 60 < block.timestamp) return true;
        return false;
    }

    // ----------------------------------------
    //       SELLER SERVER FUNCTIONALITY
    // ----------------------------------------

    function fulfillRequest(
        bytes32 hash, // Signature hash from the seller (used in place of msg.sender to allow a server to fulfill requests)
        bytes memory signature, // Signature
        address borrower,
        bytes memory encryptedAuth
    ) public nonReentrant {
        address seller = hash.toEthSignedMessageHash().recover(signature);
        require(seller != address(0), "INVALID_SIGNATURE");

        require(request[borrower].fee != 0, "INVALID_REQUEST");
        require(request[borrower].fulfilledAt == 0, "ALREADY_FULFILLEd");

        request[borrower].seller = seller;
        request[borrower].fulfilledAt = block.timestamp;
        request[borrower].encryptedAuth = encryptedAuth;
        filledRequest[seller] = borrower;

        emit FulfilledRentRequest(borrower, seller);
    }

    // ----------------------------------------
    //       BUYER FUNCTIONALITY
    // ----------------------------------------

    function _openRentRequest(uint fee, bytes memory pubkey) internal {
        uint minBalance = fee * 24 * (1 trx) / FEE_BASE;
        address borrower = msg.sender;
        require(availableBalance(borrower) >= minBalance, "INSUFFICIENT_BALANCE");

        request[borrower].fee = fee;
        request[borrower].borrower = borrower;
        request[borrower].pubkey = pubkey;

        // ZERO OUT
        request[borrower].seller = address(0);
        request[borrower].fulfilledAt = 0;
        request[borrower].encryptedAuth = "";
    }

    function openRentRequest(uint fee, bytes memory pubkey) public nonReentrant {
        require(request[msg.sender].seller == address(0), "EXISTING_OPEN_REQUEST");

        _openRentRequest(fee, pubkey);

        emit OpenedRentRequest(msg.sender, fee);
    }

    function _closeRentRequest(address borrower) internal {
        address seller = request[borrower].seller;
        filledRequest[seller] = address(0);

        if (request[borrower].fulfilledAt > 0) {
            int price = int(accumulatedFees(seller));
            _balance[borrower] -= price;
            _balance[seller] += price;
        }

        request[borrower].borrower = address(0);
        request[borrower].fee = 0;
        request[borrower].pubkey = "";

        request[borrower].seller = address(0);
        request[borrower].fulfilledAt = 0;
        request[borrower].encryptedAuth = "";
    }

    function endRent() public nonReentrant {
        require(request[msg.sender].fee != 0, "REQUEST_NOT_ACTIVE");

        _closeRentRequest(msg.sender);

        emit ClosedRentRequest(msg.sender);
    }

    function getEncryptedAuth(
        address borrower
    ) public view returns (bytes memory) {
        require(request[borrower].fee == 0, "NO_OPEN_REQUESTS");
        if (
            request[borrower].fulfilledAt == 0 ||
            block.timestamp > request[borrower].fulfilledAt + 24 * 60 * 60
        ) return "";
        return request[borrower].encryptedAuth;
    }

}
