var Migration = artifacts.require("./TodoList.sol");

module.exports = function (deployer) {
  deployer.deploy(Migration);
};
