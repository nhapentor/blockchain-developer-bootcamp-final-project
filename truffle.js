// const path = require("path");
const HDWalletProvider = require("truffle-hdwallet-provider");

require('dotenv').config()
module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  // contracts_build_directory: path.join(__dirname, "client/lib/contracts"),
  networks: {
    development: {
      provider: () =>
        new HDWalletProvider(process.env.MNEMONIC, "http://127.0.0.1:8545", 0, 3),
      network_id: '*' // Match any network id
    },
    rinkeby: {provider: () =>
      new HDWalletProvider(process.env.MNEMONIC, "https://rinkeby.infura.io/v3/c41b2f4fea7f413ab342dd5a20d5f9e6", 0, 3),
      network_id: '4' // Match any network id
    }
  },
  compilers: {
    solc: {
      version: "0.8.10"
    }
  }
};
