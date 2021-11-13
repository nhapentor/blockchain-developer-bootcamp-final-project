import Web3 from 'web3'

const Gsn = require('@opengsn/provider')

const RelayProvider = Gsn.RelayProvider

const resolveWeb3 = async (resolve) => {

  const localProvider = `http://localhost:8545`


  if (typeof window.ethereum !== 'undefined') {
    console.log('MetaMask is installed!');
    const web3 = new Web3(window.ethereum)

    const network = {
      relayHub: require('../../build/gsn/RelayHub.json').address,
      paymaster: require('../../build/gsn/Paymaster.json').address,
      forwarder: require('../../build/gsn/Forwarder.json').address
    }


  const gsnConfig = {
      relayLookupWindowBlocks: 600000,
      paymasterAddress: network.paymaster
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

// export default () =>
//   new Promise((resolve) => {
//     // Wait for loading completion to avoid race conditions with web3 injection timing.
//     window.addEventListener(`load`, () => {
//       resolveWeb3(resolve)
//     })
//     // If document has loaded already, try to get Web3 immediately.
//     if (document.readyState === `complete`) {
//       resolveWeb3(resolve)
//     }
//   })

export default () =>
  new Promise((resolve) => {
      resolveWeb3(resolve)
  })