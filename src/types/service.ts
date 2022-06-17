import {
	JsonRpcProvider,
	JsonRpcSigner,
	TransactionReceipt,
	TransactionRequest,
	TransactionResponse
} from "@ethersproject/providers";
import { BigNumber, BigNumberish, PopulatedTransaction as PopulatedTx, utils } from "ethers";

import { TokenConfig } from ".";

export interface Token {
	address: string
	name: string
	symbol: string
	decimals: number

	_allowance: (owner: string, spender: string) => PopulatedTx
	_balanceOf: (account: string) => PopulatedTx
	_approve: (spender: string, value: BigNumberish) => Promise<PopulatedTx>
	_transfer: (recipient: string, value: BigNumberish) => Promise<PopulatedTx>
	_transferFrom: (sender: string, recipient: string, value: BigNumberish) => Promise<PopulatedTx>

	allowance: (owner: string, spender: string) => Promise<BigNumber>
	balanceOf: (account: string) => Promise<BigNumber>
	approve: (spender: string, value: BigNumberish, caller: string) => Promise<TransactionReceipt>
	transfer: (recipient: string, value: BigNumberish, caller: string) => Promise<TransactionReceipt>
	transferFrom: (recipient: string, value: BigNumberish, caller: string) => Promise<TransactionReceipt>
}

export interface WrappedNative {
	_deposit: (value: BigNumberish) => Promise<PopulatedTx>
	_withdraw: (value: BigNumberish) => Promise<PopulatedTx>

	deposit: (value: BigNumberish, caller: string) => Promise<TransactionReceipt>
	withdraw: (value: BigNumberish, caller: string) => Promise<TransactionReceipt>
}

export interface Manager {
	registry: string
	factories: string[]
	totalFactories: number

	getFactory: (factoryId: number) => string
}

export interface Registry {
	manager: string
}

export interface Router { }

export interface Factory {
	id: number
	vaults: string[]
	totalVaults: number

	getVault: (vaultId: number) => string

}

export interface Vault {
	id: number
	// protocol: string
	factory: string
	strategy: string
	underlying: TokenConfig

	_totalAssets: () => Promise<PopulatedTx>
	_totalValues: () => Promise<PopulatedTx>

	totalAssets: () => Promise<BigNumber>
	totalValues: () => Promise<BigNumber>
}

export interface Strategy {
	vault: string
	asset: string
}
