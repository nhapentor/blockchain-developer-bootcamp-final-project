const Xaber = artifacts.require('./XABER.sol')
const Employees = artifacts.require('./Employees.sol')
const DiscussionBoard = artifacts.require('./DiscussionBoard.sol')
const WhitelistPaymaster = artifacts.require('./WhitelistPaymaster.sol')

module.exports = async (deployer) => {
  
  // const forwarder = require('../build/gsn/Forwarder.json').address

  // await deployer.deploy(Xaber, forwarder)
  // await deployer.deploy(DiscussionBoard, Xaber.address, forwarder)
  // await deployer.deploy(Employees, Xaber.address, forwarder)

  // const xaberInstance = await Xaber.deployed();

  // await xaberInstance.addMinter(Employees.address);

  await deployer.deploy(WhitelistPaymaster)

}
