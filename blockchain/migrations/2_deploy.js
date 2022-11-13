const fs = require('fs');
const path = require('path');

const KeyStream = artifacts.require("./KeyStream.sol");

module.exports = async function(deployer) {
  const result = deployer.deploy(KeyStream);
  const res = await result.await;
  const abi = res.abi;

  // Write abi as JSON to '../extension/src/KeyStreamABI.json'
  const filePath = path.join(__dirname, '../../extension/src/KeyStreamABI.json');
  fs.writeFileSync(filePath, JSON.stringify(abi, null, 2));

  console.log(res.address);
};
