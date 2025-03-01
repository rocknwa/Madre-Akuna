const ethers = require("ethers")
/**
 * This file could be used for adding functions you
 * may need to call multiple times or as a way to
 * abstract logic from bot.js. Feel free to add
 * in your own functions you desire here!
 */

const IERC20 = require('@openzeppelin/contracts/build/contracts/ERC20.json')

async function getTokenAndContract(_token0Address, _token1Address, _provider) {
  const token0Contract = new ethers.Contract(_token0Address, IERC20.abi, _provider)
  const token1Contract = new ethers.Contract(_token1Address, IERC20.abi, _provider)

  const token0 = {
    contract: token0Contract,
    address: _token0Address,
    symbol: await token0Contract.symbol(),
    decimals: await token0Contract.decimals(),
  }

  const token1 = {
    contract: token1Contract,
    address: _token1Address,
    symbol: await token1Contract.symbol(),
    decimals: await token1Contract.decimals(),
  }

  return { token0, token1 }
}

module.exports = {
  getTokenAndContract
}