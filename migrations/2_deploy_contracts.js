const Xaber = artifacts.require('./XABER.sol')
const Employees = artifacts.require('./Employees.sol')
const DiscussionBoard = artifacts.require('./DiscussionBoard.sol')
const Badges = artifacts.require('./Badges.sol')

require('dotenv').config()

module.exports = async (deployer) => {

  const forwarder = deployer.network.includes("rinkeby") ? 
  process.env.RINKEBY_TRUSTED_FORWARDER_ADDRESS : 
  require('../build/gsn/Forwarder.json').address  

  await deployer.deploy(Xaber, forwarder)
  await deployer.deploy(Badges)
  await deployer.deploy(DiscussionBoard, Xaber.address, forwarder)
  await deployer.deploy(Employees, Xaber.address, Badges.address, forwarder)

  const xaberInstance = await Xaber.deployed();
  await xaberInstance.addMinter(Employees.address);
  await xaberInstance.addBurner(Employees.address);

  const badgesInstance = await Badges.deployed();
  await badgesInstance.addMinter(Employees.address);

}
