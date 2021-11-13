const path = require("path");
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
    }
  },
  compilers: {
    solc: {
      version: "^0.8.0"
    }
  }
};
