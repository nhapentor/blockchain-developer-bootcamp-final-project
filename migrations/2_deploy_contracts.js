const Xaber = artifacts.require('./XABER.sol')

module.exports = async (deployer) => {
  
  const forwarder = require('../build/gsn/Forwarder.json').address

  await deployer.deploy(Xaber, forwarder)
}
