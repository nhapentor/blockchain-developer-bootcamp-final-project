const HDWalletProvider = require("truffle-hdwallet-provider");

require('dotenv').config()
module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  // contracts_build_directory: "./build/contracts",
  networks: {
    development: {
      provider: () =>
        new HDWalletProvider(process.env.MNEMONIC, "http://127.0.0.1:8545", 0, 3),
      network_id: '*' // Match any network id
    },
    rinkeby: {provider: () =>
      new HDWalletProvider(process.env.MNEMONIC, process.env.RINKEBY_ENDPOINT_URL, 0, 3),
      network_id: '4',
      skipDryRun: true
    }
  },
  compilers: {
    solc: {
      version: "0.8.10"
    }
  }
};
