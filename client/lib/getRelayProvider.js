import Web3 from 'web3'

const Gsn = require('@opengsn/provider')

const RelayProvider = Gsn.RelayProvider

const resolveWeb3 = async (resolve) => {

  if (typeof window.ethereum !== 'undefined') {

    const web3 = new Web3(window.ethereum)    

    const chainId = await web3.eth.getChainId()

    const gsnConfig = {    
      preferredRelays: chainId === 4 ? [process.env.NEXT_PUBLIC_GSN_RELAYER] : [],
      relayLookupWindowBlocks: 600000,
      paymasterAddress: chainId === 4 ? process.env.NEXT_PUBLIC_RINKEBY_PAYMASTER_ADDRESS : require('../../build/gsn/Paymaster.json').address
    }

    const provider = RelayProvider.newProvider({ provider: web3.currentProvider, config: gsnConfig })
    await provider.init()

    web3.setProvider(provider)

    resolve(web3)

  } else {
    console.log(`No web3 instance injected, using Local web3.`)
    resolve(new Web3(localProvider))
  }

  resolve(web3)
}

export default () =>
  new Promise((resolve) => {
      resolveWeb3(resolve)
  })