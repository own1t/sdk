import { Mapping } from "./types"

export enum CHAIN_ID {
	MAINNET = 1,
	OPTIMISM = 10,
	BSC = 56,
	XDAI = 100,
	POLYGON = 137,
	FANTOM = 250,
	ARBITRUM = 42161,
	AVALANCHE = 43114,
	HARMONY = 1666600000,
}

export const WETH_ADDRESS: Mapping<string> = {
	[CHAIN_ID.MAINNET]: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
	[CHAIN_ID.OPTIMISM]: "0x4200000000000000000000000000000000000006",
	[CHAIN_ID.BSC]: "0x2170Ed0880ac9A755fd29B2688956BD959F933F8",
	[CHAIN_ID.XDAI]: "0x6A023CCd1ff6F2045C3309768eAd9E68F978f6e1",
	[CHAIN_ID.POLYGON]: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
	[CHAIN_ID.FANTOM]: "0x74b23882a30290451A17c44f4F05243b6b58C76d",
	[CHAIN_ID.ARBITRUM]: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
	[CHAIN_ID.AVALANCHE]: "0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB", // WETH.e
	[CHAIN_ID.HARMONY]: "0x6983D1E6DEf3690C4d616b13597A09e6193EA013",
}

const WAVAX_ADDRESS = "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7"
const WBNB_ADDRESS = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"
const WFTM_ADDRESS = "0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83"
const WMATIC_ADDRESS = "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270"
const WONE_ADDRESS = "0xcF664087a5bB0237a0BAd6742852ec6c8d69A27a"
const WXDAI_ADDRESS = "0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d"

export const WRAPPED_NATIVE: Mapping<string> = {
	[CHAIN_ID.MAINNET]: WETH_ADDRESS[CHAIN_ID.MAINNET],
	[CHAIN_ID.OPTIMISM]: WETH_ADDRESS[CHAIN_ID.OPTIMISM],
	[CHAIN_ID.BSC]: WBNB_ADDRESS,
	[CHAIN_ID.XDAI]: WXDAI_ADDRESS,
	[CHAIN_ID.POLYGON]: WMATIC_ADDRESS,
	[CHAIN_ID.FANTOM]: WFTM_ADDRESS,
	[CHAIN_ID.ARBITRUM]: WETH_ADDRESS[CHAIN_ID.ARBITRUM],
	[CHAIN_ID.AVALANCHE]: WAVAX_ADDRESS,
	[CHAIN_ID.HARMONY]: WONE_ADDRESS,
}

export const NETWORK = {
	MAINNET: {
		chainId: CHAIN_ID.MAINNET,
		wrappedNative: {
			chainId: CHAIN_ID.MAINNET,
			address: WRAPPED_NATIVE[CHAIN_ID.MAINNET],
			name: "Wrapped Ether",
			symbol: "WETH",
			decimals: 18
		},
		blocksPerDay: 5760
	},
	OPTIMISM: {
		chainId: CHAIN_ID.OPTIMISM,
		wrappedNative: {
			chainId: CHAIN_ID.OPTIMISM,
			address: WRAPPED_NATIVE[CHAIN_ID.OPTIMISM],
			name: "Wrapped Ether",
			symbol: "WETH",
			decimals: 18
		},
		blocksPerDay: 6646
	},
	BSC: {
		chainId: CHAIN_ID.BSC,
		wrappedNative: {
			chainId: CHAIN_ID.BSC,
			address: WRAPPED_NATIVE[CHAIN_ID.BSC],
			name: "Wrapped BNB",
			symbol: "WBNB",
			decimals: 18
		},
		blocksPerDay: 28800
	},
	XDAI: {
		chainId: CHAIN_ID.XDAI,
		wrappedNative: {
			chainId: CHAIN_ID.XDAI,
			address: WRAPPED_NATIVE[CHAIN_ID.XDAI],
			name: "Wrapped xDai",
			symbol: "WXDAI",
			decimals: 18
		},
		blocksPerDay: 0
	},
	POLYGON: {
		chainId: CHAIN_ID.POLYGON,
		wrappedNative: {
			chainId: CHAIN_ID.POLYGON,
			address: WRAPPED_NATIVE[CHAIN_ID.POLYGON],
			name: "Wrapped Matic",
			symbol: "WMATIC",
			decimals: 18
		},
		blocksPerDay: 43200
	},
	FANTOM: {
		chainId: CHAIN_ID.FANTOM,
		wrappedNative: {
			chainId: CHAIN_ID.FANTOM,
			address: WRAPPED_NATIVE[CHAIN_ID.FANTOM],
			name: "Wrapped FTM",
			symbol: "WFTM",
			decimals: 18
		},
		blocksPerDay: 123428
	},
	ARBITRUM: {
		chainId: CHAIN_ID.ARBITRUM,
		wrappedNative: {
			chainId: CHAIN_ID.ARBITRUM,
			address: WRAPPED_NATIVE[CHAIN_ID.ARBITRUM],
			name: "Wrapped Ether",
			symbol: "WETH",
			decimals: 18
		},
		blocksPerDay: 5760
	},
	AVALANCHE: {
		chainId: CHAIN_ID.AVALANCHE,
		wrappedNative: {
			chainId: CHAIN_ID.AVALANCHE,
			address: WRAPPED_NATIVE[CHAIN_ID.AVALANCHE],
			name: "Wrapped AVAX",
			symbol: "WAVAX",
			decimals: 18
		},
		blocksPerDay: 86400
	},
	HARMONY: {
		chainId: CHAIN_ID.HARMONY,
		wrappedNative: {
			chainId: CHAIN_ID.HARMONY,
			address: WRAPPED_NATIVE[CHAIN_ID.HARMONY],
			name: "Wrapped ONE",
			symbol: "WONE",
			decimals: 18
		},
		blocksPerDay: 86400
	},
}
