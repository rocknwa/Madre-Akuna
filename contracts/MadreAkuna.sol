// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {ISwapRouter} from "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";


contract MadreAkuna is ReentrancyGuard{
    // Event emitted when tokens are transferred.
    event TokenTransferred(
        address indexed token,
        address indexed from,
        address indexed to,
        uint256 amount
    );

    // Event emitted when a swap is executed.
    event SwapExecuted(
        address indexed router,
        address indexed tokenIn,
        address indexed tokenOut,
        uint256 amountIn,
        uint256 amountOutMinimum,
        uint24 fee,
        uint256 amountOutReceived
    );

    /// @notice Transfers tokens from the caller's wallet to a specified address.
    /// @param token The ERC20 token address.
    /// @param to The recipient address.
    /// @param amount The amount of tokens to transfer.
    /// @return success True if the transfer succeeded.
    function transferTokens(
        address token,
        address to,
        uint256 amount
    ) external returns (bool success) {
        success = IERC20(token).transferFrom(msg.sender, to, amount);
        require(success, "Transfer failed");
        emit TokenTransferred(token, msg.sender, to, amount);
    }

    /// @notice Swaps an exact amount of tokenIn for as many tokenOut as possible using Uniswap V3.
    /// @param _router The address of the Uniswap V3 router.
    /// @param _tokenIn The address of the input token.
    /// @param _amountIn The exact amount of tokenIn to swap.
    /// @param _tokenOut The address of the output token.
    /// @param _amountOut The minimum acceptable amount of tokenOut.
    /// @param _fee The fee tier of the pool (e.g. 3000 for 0.3%).
    function _swapOnV3(
        address _router,
        address _tokenIn,
        uint256 _amountIn,
        address _tokenOut,
        uint256 _amountOut,
        uint24 _fee
    ) external nonReentrant {
         // Transfer the specified amount of tokenIn to this contract.
        require(
            IERC20(_tokenIn).transferFrom(msg.sender, address(this), _amountIn), 
            "Transfer failed"
            ); 
        
        // Approve the Uniswap router to spend the input token.
        require(
            IERC20(_tokenIn).approve(_router, _amountIn),
            "Approval failed"
        );

        // Setup swap parameters.
        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter
            .ExactInputSingleParams({
                tokenIn: _tokenIn,
                tokenOut: _tokenOut,
                fee: _fee,
                recipient: msg.sender,
                deadline: block.timestamp + 300, // 5 minute buffer
                amountIn: _amountIn,
                amountOutMinimum: _amountOut,
                sqrtPriceLimitX96: 0
            });

        // Execute the swap and capture the amount of output tokens received.
        uint256 amountOutReceived = ISwapRouter(_router).exactInputSingle(params);

        emit SwapExecuted(
            _router,
            _tokenIn,
            _tokenOut,
            _amountIn,
            _amountOut,
            _fee,
            amountOutReceived
        );
    }
}
