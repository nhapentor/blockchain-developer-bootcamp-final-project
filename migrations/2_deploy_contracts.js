const SimpleStorage = artifacts.require('./SimpleStorage.sol')
const Xaber = artifacts.require('./XABER.sol')

module.exports = function (deployer) {
  deployer.deploy(SimpleStorage)
  deployer.deploy(Xaber)
}
