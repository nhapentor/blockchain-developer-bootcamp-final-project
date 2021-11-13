const Xaber = artifacts.require('./XABER.sol')
const Employees = artifacts.require('./Employees.sol')

module.exports = async (deployer) => {
  
  const forwarder = require('../build/gsn/Forwarder.json').address

  await deployer.deploy(Xaber, forwarder)

  await deployer.deploy(Employees)
}
