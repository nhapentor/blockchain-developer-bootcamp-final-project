import getContractInstance from './getContract'
import tokenContractDefinition from '../../build/contracts/XABER.json'

export const getTokenContract = async (web3, deployedAddress) => {
  return getContractInstance(web3, tokenContractDefinition, deployedAddress)
}
