// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

interface IBeakerRegistry {
    function manager() external view returns (address);

    function getModule(bytes32 id) external view returns (address);

    function getProtocol(uint256 id) external view returns (address);
}
