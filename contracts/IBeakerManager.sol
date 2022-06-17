// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

interface IBeakerManager {
    function registry() external view returns (address);

    function getProtocol(uint256 id) external view returns (address);

    function numProtocols() external view returns (uint256);
}
