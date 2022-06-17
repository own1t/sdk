import { JsonRpcProvider, Web3Provider } from "@ethersproject/providers";
import { BigNumber, BytesLike, Contract, PopulatedTransaction as PopulatedTx, utils } from "ethers";

export * as ServiceInterfaces from "./service";

export type Mapping<T> = { [key: string | number]: T }

export type Provider = JsonRpcProvider | Web3Provider

export interface TokenConfig {
	readonly address: string
	readonly name: string
	readonly symbol: string
	readonly decimals: number
}

export interface VaultConfig extends TokenConfig {
	readonly id: number
	// readonly protocol: string
	readonly factory: string
	readonly strategy: string
	readonly underlying: TokenConfig
}

export interface StrategyConfig {
	readonly address: string
	readonly vault: string
	readonly asset: string
}

export interface FactoryConfig {
	readonly id: number
	readonly address: string
	readonly vaults: string[]
	readonly totalVaults: number
}

export interface ManagerConfig {
	readonly address: string
	readonly registry: string
	readonly factories: string[]
	readonly totalFactories: number
}

export interface RegistryConfig {
	readonly address: string
	readonly manager: string
}

export interface MulticallParams {
	allowFailure: boolean
	contract: Contract
	unsignedTx: PopulatedTx
}
