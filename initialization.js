require("dotenv").config()
const ethers = require('ethers')

/**
 * This file could be used for initializing some
 * of the main contracts such as the V3 router & 
 * factory. This is also where we initialize the
 * main Arbitrage contract.
 */

const config = require('../config.json')
const IUniswapV3Factory = require('@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Factory.sol/IUniswapV3Factory.json')
const IQuoter = require('@uniswap/v3-periphery/artifacts/contracts/interfaces/IQuoterV2.sol/IQuoterV2.json')

let provider

if (config.PROJECT_SETTINGS.isLocal) {
  provider = new ethers.WebSocketProvider(`ws://127.0.0.1:8545/`)
} else {
  provider = new ethers.WebSocketProvider(`wss://arb-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`)
}

// -- SETUP UNISWAP V3 CONTRACTS -- //
const uniswap = {
  name: "Uniswap V3",
  factory: new ethers.Contract(config.UNISWAP.FACTORY_V3, IUniswapV3Factory.abi, provider),
  quoter: new ethers.Contract(config.UNISWAP.QUOTER_V3, IQuoter.abi, provider),
  router: new ethers.Contract(config.UNISWAP.ROUTER_V3, ISwapRouter.abi, provider)
}


module.exports = {
  provider,
  uniswap
}