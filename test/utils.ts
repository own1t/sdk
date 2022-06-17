import { ethers, network } from "hardhat";
import { CHAIN_ID } from "../src/network";

export const switchChains = async (chainId: number, blockNumber?: number) => {

	let jsonRpcUrl: string = ''

	switch (chainId) {
		case CHAIN_ID.MAINNET:
			jsonRpcUrl = `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`
			break

		case CHAIN_ID.ARBITRUM:
			jsonRpcUrl = `https://arbitrum-mainnet.infura.io/v3/${process.env.INFURA_PROJECT_ID}`
			break

		case CHAIN_ID.AVALANCHE:
			jsonRpcUrl = "https://api.avax.network/ext/bc/C/rpc"
			break

		default:
			throw new Error(`chain ID ${chainId} is not supported for network forking`)
	}

	await network.provider.request({
		method: "hardhat_reset",
		params: [
			{
				chainId: chainId,
				forking:
					blockNumber ? {
						jsonRpcUrl: jsonRpcUrl,
						blockNumber: blockNumber,
					} : {
						jsonRpcUrl: jsonRpcUrl,
					},
			},
		],
	})
}
