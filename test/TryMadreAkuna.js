// -- HANDLE INITIAL SETUP -- //
require("dotenv").config();

const ethers = require("ethers");
const config = require('../config.json');
const { getTokenAndContract } = require('./helpers/helpers');
const { provider } = require('./helpers/initialization');

// -- CONFIGURATION VALUES HERE -- //
const TOKEN_TO_TRANSFER = config.TOKENS.TOKEN_TO_TRANSFER;
const TOKEN_TO_SWAP = config.TOKENS.TOKEN_TO_SWAP;
const POOL_FEE = config.TOKENS.POOL_FEE;
const SWAP_AMOUNT_IN = config.TOKENS.SWAP_AMOUNT_IN;
const MIN_AMOUNT_OUT = config.TOKENS.MIN_AMOUNT_OUT;
const UNISWAP_ROUTER = config.UNISWAP_ROUTER;
const MADRE_AKUNA_CONTRACT_ADDRESS = config.CONTRACTS.MADRE_AKUNA;

const main = async () => {
  const { tokenToTransfer, tokenToSwap } = await getTokenAndContract(TOKEN_TO_TRANSFER, TOKEN_TO_SWAP, provider);
  const madreAkuna = new ethers.Contract(MADRE_AKUNA_CONTRACT_ADDRESS, [
    "function transferTokens(address token, address to, uint256 amount) external returns (bool)",
    "function _swapOnV3(address _router, address _tokenIn, uint256 _amountIn, address _tokenOut, uint256 _amountOut, uint24 _fee) external"
  ], provider);

  console.log(`Using ${tokenToTransfer.symbol} and ${tokenToSwap.symbol}\n`);

  // Transfer Tokens
  await transferTokens(madreAkuna, tokenToTransfer, config.RECIPIENT_ADDRESS, config.TRANSFER_AMOUNT);

  // Swap Tokens on Uniswap
  await swapTokensOnUniswap(madreAkuna, tokenToSwap, SWAP_AMOUNT_IN, tokenToTransfer, MIN_AMOUNT_OUT);
};

const transferTokens = async (_madreAkuna, _token, _to, _amount) => {
  const account = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  const transaction = await _madreAkuna.connect(account).transferTokens(_token.address, _to, _amount);
  const receipt = await transaction.wait();
  console.log(`Receipt: ${receipt.transactionHash}`);
  console.log(`Tokens Transferred: ${_amount} ${_token.symbol} to ${_to}`);
};

const swapTokensOnUniswap = async (_madreAkuna, _tokenIn, _amountIn, _tokenOut, _amountOutMinimum) => {
  const account = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  const transaction = await _madreAkuna.connect(account)._swapOnV3(
    UNISWAP_ROUTER,
    _tokenIn.address,
    _amountIn,
    _tokenOut.address,
    _amountOutMinimum,
    POOL_FEE
  );
  const receipt = await transaction.wait();
  console.log(`Receipt: ${receipt.transactionHash}`);
  console.log(`Tokens Swapped: ${_amountIn} ${_tokenIn.symbol} for minimum ${_amountOutMinimum} ${_tokenOut.symbol}`);
};

main().catch(error => {
  console.error(error);
  process.exit(1);
});