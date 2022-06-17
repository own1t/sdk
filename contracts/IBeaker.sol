// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

import "./IERC20Metadata.sol";

// import "./IERC20Permit.sol";
// import "./IERC4626.sol";

interface IBeaker is IERC20Metadata {
    function vaultId() external view returns (uint16);

    function asset() external view returns (address);

    function factory() external view returns (address);

    function router() external view returns (address);

    function strategy() external view returns (address);

    function cap() external view returns (uint256);

    function totalAssets() external view returns (uint256);

    function totalValues() external view returns (uint256);
}
