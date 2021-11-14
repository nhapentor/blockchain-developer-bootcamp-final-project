import Web3 from 'web3'
import xaberContractDefinition from '../../../../build/contracts/XABER.json'
import getContract from '../../../lib/getContract'

const handler =  async (req, res) => {

    const localProvider = `http://localhost:8545`
    const web3 = new Web3(localProvider)

    const account = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY)


    const contract = await getContract(web3, xaberContractDefinition)


    // await contract.methods.mint(web3.utils.toChecksumAddress("0x69e57498bD6D7FCa5c9bF0e298bc002c0191D6a7"), web3.utils.toWei("0.2")).send({ from: account.address })
    

    res.status(200).json({key: process.env.PRIVATE_KEY})
  
}

export default handler