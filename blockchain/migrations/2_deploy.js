const KeyStream = artifacts.require("./KeyStream.sol");

module.exports = function(deployer) {
  deployer.deploy(KeyStream);
};
