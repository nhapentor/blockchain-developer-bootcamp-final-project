import Web3 from 'web3'

const resolveWeb3 = async (resolve) => {

  
  const localProvider = `http://localhost:8545`


  if (typeof window.ethereum !== 'undefined') {
    console.log('MetaMask is installed!');
    const web3 = new Web3(window.ethereum)
    resolve(web3)
  } else {
    console.log(`No web3 instance injected, using Local web3.`)
    const provider = new Web3(localProvider)
    resolve(new Web3(provider))
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