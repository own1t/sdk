// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

import { IERC20Metadata } from "./IERC20Metadata.sol";

interface IWrappedNative is IERC20Metadata {
    function deposit() external payable;

    function withdraw(uint256 value) external;
}
