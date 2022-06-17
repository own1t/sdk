import { BigNumber, BigNumberish, Signer, utils } from "ethers";

import { Service } from "./base";
import { FactoryConfig, MulticallParams, Provider, ServiceInterfaces } from "../types";

import { IBeakerFactory__factory } from "../../typechain";


export class FactoryService extends Service implements ServiceInterfaces.Factory {
	readonly config: FactoryConfig

	constructor(chainId: number, provider: Provider, config: FactoryConfig) {
		super(chainId, provider)

		this.config = config
	}

	static async initialize(provider: Provider, address: string) {
		const chainId = provider.network.chainId
		const factory = IBeakerFactory__factory.connect(utils.getAddress(address), provider)

		const protocolId = (await factory.protocolId()).toNumber()
		const numVaults = (await factory.numVaults()).toNumber()
		let vid = 0
		const calls: MulticallParams[] = []

		while (vid < numVaults) {
			const unsignedTx = await factory.populateTransaction.getVault(vid)
			calls.push({ allowFailure: true, contract: factory, unsignedTx })
			vid++
		}

		const vaultAddresses = (await Service.aggregate(provider, calls) as string[]).filter((vault) => utils.isAddress(vault))

		const config = {
			id: protocolId,
			address: factory.address,
			vaults: vaultAddresses,
			totalVaults: vaultAddresses.length
		}

		return new FactoryService(chainId, provider, config)
	}

	get id() {
		return this.config.id
	}

	get address() {
		return this.config.address
	}

	get vaults() {
		return this.config.vaults
	}

	get totalVaults() {
		return this.config.totalVaults
	}

	contract(signer?: Signer) {
		return IBeakerFactory__factory.connect(this.address, signer ? signer : this.provider)
	}

	getVault(vaultId: number) {
		return this.config.vaults[vaultId]
	}
}
