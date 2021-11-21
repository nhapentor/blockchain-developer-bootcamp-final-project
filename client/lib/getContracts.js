import getContractInstance from './getContract'
import tokenContractDefinition from '../../build/contracts/XABER.json'
import discusstionBoardContractDefinition from '../../build/contracts/DiscussionBoard.json'
import discusstionContractDefinition from '../../build/contracts/Discussion.json'
import employeesContractDefinition from '../../build/contracts/Employees.json'
import badgesContractDefinition from '../../build/contracts/Badges.json'

export const getTokenContract = async (web3, deployedAddress) => {
  return getContractInstance(web3, tokenContractDefinition, deployedAddress)
}

export const getDiscussionBoardContract = async (web3, deployedAddress) => {
  return getContractInstance(web3, discusstionBoardContractDefinition, deployedAddress)
}

export const getDiscussionContract = async (web3, deployedAddress) => {
  return getContractInstance(web3, discusstionContractDefinition, deployedAddress)
}

export const getEmployeesContract = async (web3, deployedAddress) => {
  return getContractInstance(web3, employeesContractDefinition, deployedAddress)
}

export const getBadgesContract = async (web3, deployedAddress) => {
  return getContractInstance(web3, badgesContractDefinition, deployedAddress)
}