require("dotenv").config()
const ethers = require('ethers')

/**
 * This file could be used for initializing some
 * of the main contracts such as the V3 router & 
 * factory. This is also where we initialize the
 * main Arbitrage contract.
 */

const config = require('../config.json');
 
const provider = new ethers.WebSocketProvider(`wss://arb-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`);

// -- SETUP UNISWAP V3 CONTRACTS -- //
const router = new ethers.Contract(config.ROUTER_V3, ISwapRouter.abi, provider);


module.exports = {
  provider,
  router,
}