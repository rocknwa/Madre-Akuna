# MadreAkuna Smart Contract

## Overview

MadreAkuna is a smart contract that facilitates token transfers and token swaps using Uniswap V3. It leverages OpenZeppelin's ERC20 library and ReentrancyGuard for security.

## Features

1. **Token Transfer**: Allows users to transfer ERC20 tokens from their wallet to another address.
2. **Token Swap**: Allows users to swap an exact amount of one ERC20 token for as many as possible of another ERC20 token using Uniswap V3.

## Contract Details

### Events

- **TokenTransferred**: Emitted when tokens are transferred.
  - `token`: The address of the ERC20 token.
  - `from`: The address of the sender.
  - `to`: The address of the recipient.
  - `amount`: The amount of tokens transferred.

- **SwapExecuted**: Emitted when a swap is executed.
  - `router`: The address of the Uniswap V3 router.
  - `tokenIn`: The address of the input token.
  - `tokenOut`: The address of the output token.
  - `amountIn`: The exact amount of input token swapped.
  - `amountOutMinimum`: The minimum acceptable amount of output token.
  - `fee`: The fee tier of the pool.
  - `amountOutReceived`: The amount of output token received.

### Functions

- **transferTokens**
  - Transfers tokens from the caller's wallet to a specified address.
  - Parameters:
    - `token`: The ERC20 token address.
    - `to`: The recipient address.
    - `amount`: The amount of tokens to transfer.
  - Returns: `success` - True if the transfer succeeded.

- **_swapOnV3**
  - Swaps an exact amount of `tokenIn` for as many `tokenOut` as possible using Uniswap V3.
  - Parameters:
    - `_router`: The address of the Uniswap V3 router.
    - `_tokenIn`: The address of the input token.
    - `_amountIn`: The exact amount of `tokenIn` to swap.
    - `_tokenOut`: The address of the output token.
    - `_amountOut`: The minimum acceptable amount of `tokenOut`.
    - `_fee`: The fee tier of the pool (e.g. 3000 for 0.3%).

## Usage

### Transfer Tokens

To transfer tokens, call the `transferTokens` function with the appropriate parameters:

```solidity
function transferTokens(
    address token,
    address to,
    uint256 amount
) external returns (bool success);