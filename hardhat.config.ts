import * as dotenv from "dotenv";

import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";

dotenv.config();

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
	const accounts = await hre.ethers.getSigners();

	for (const account of accounts) {
		console.log(account.address);
	}
});

const config: HardhatUserConfig = {
	solidity: "0.8.10",
	networks: {
		hardhat: {
			forking: {
				url: `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`,
			},
			initialBaseFeePerGas: 0,
			allowUnlimitedContractSize: true,
			blockGasLimit: 0x1fffffffffffff,
			gas: 12000000,
		},
		mainnet: {
			url: `https://mainnet.infura.io/v3/${process.env.INFURA_PROJECT_ID}`,
			chainId: 1
		},
		arbitrum: {
			url: `https://arb1.arbitrum.io/rpc`,
			chainId: 42161
		},
		avalanche: {
			url: `https://api.avax.network/ext/bc/C/rpc`,
			chainId: 43114
		},
	},
	gasReporter: {
		enabled: true,
		currency: "USD",
	},
	etherscan: {
		apiKey: process.env.ETHERSCAN_API_KEY,
	},
};

export default config;
