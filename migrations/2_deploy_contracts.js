var ERC20d = artifacts.require("./ERC20d.sol");

module.exports = function(deployer) {
  deployer.deploy(ERC20d);
};
