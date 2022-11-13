const fs = require('fs');
const path = require('path');

const KeyStream = artifacts.require("./KeyStream.sol");

const FILE_TARGETS = [
  '../../extension/src/KeyStreamDeployment.json',
  '../../frontend/src/KeyStreamDeployment.json'
];

module.exports = async function(deployer) {
  const result = deployer.deploy(KeyStream);
  const res = await result.await;

  for (const file_target of FILE_TARGETS) {
    const filePath = path.join(__dirname, file_target);
    fs.writeFileSync(filePath, JSON.stringify({
      abi: res.abi,
      address: res.address
    }, null, 2));
  }
};
