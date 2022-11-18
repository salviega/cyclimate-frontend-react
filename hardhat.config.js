require('@nomiclabs/hardhat-waffle')
require('@nomiclabs/hardhat-etherscan')
require('dotenv').config()

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  paths: {
    sources: './src/blockchain/hardhat/contracts',
    tests: './src/blockchain/hardhat/test',
    cache: './src/blockchain/hardhat/cache',
    artifacts: './src/blockchain/hardhat/artifacts'
  },
  etherscan: {
    apiKey: process.env.POLYGONSCAN_API_KEY
  },

  defaultNetwork: 'hardhat',
  networks: {
    hardhat: {
      allowUnlimitedContractSize: true,
      forking: {
        url: 'https://rpc-mumbai.maticvigil.com'
      }
    },
    localhost: {},
    matic: {
      url: 'https://rpc-mumbai.maticvigil.com',
      accounts: [process.env.PRIVATE_KEY]
    }
  },
  solidity: '0.8.15'
}
