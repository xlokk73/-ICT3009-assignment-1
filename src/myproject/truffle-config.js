var HDWalletProvider = require("truffle-hdwallet-provider");
var mnemonic = "improve ivory isolate one autumn fox pioneer use scale fix gown awake";

module.exports = {

  networks: {
    development: {
     host: "127.0.0.1",
     port: 8545,
     network_id: "*"
    },
    rinkeby: {
        provider: function() { 
         return new HDWalletProvider(mnemonic, "https://rinkeby.infura.io/v3/a16e629611694f93b2e57905a8a587a3");
        },
        network_id: 4,
        gas: 4500000,
        gasPrice: 10000000000,
    }
   },

  // Set default mocha options here, use special reporters etc.
  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.6.6",    // Fetch exact version from solc-bin (default: truffle's version)
      // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
      // settings: {          // See the solidity docs for advice about optimization and evmVersion
      //  optimizer: {
      //    enabled: false,
      //    runs: 200
      //  },
      //  evmVersion: "byzantium"
      // }
    }
  }
};
