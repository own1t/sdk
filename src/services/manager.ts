import { BigNumber, BigNumberish, Signer, utils } from "ethers";

import { Service } from "./base";
import { ManagerConfig, MulticallParams, Provider, ServiceInterfaces } from "../types";

import { IBeakerManager__factory } from "../../typechain/factories/IBeakerManager__factory";

export class ManagerService extends Service implements ServiceInterfaces.Manager {
	readonly config: ManagerConfig

	constructor(chainId: number, provider: Provider, config: ManagerConfig) {
		super(chainId, provider)

		this.config = config
	}

	static async initialize(provider: Provider, address: string) {
		const chainId = provider.network.chainId
		const manager = IBeakerManager__factory.connect(utils.getAddress(address), provider)

		const registry = await manager.registry()
		const numFactories = (await manager.numProtocols()).toNumber()
		let fid = 0
		const calls: MulticallParams[] = []

		while (fid < numFactories) {
			const unsignedTx = await manager.populateTransaction.getProtocol(fid)
			calls.push({ allowFailure: true, contract: manager, unsignedTx })
			fid++
		}

		const factoryAddresses = (await Service.aggregate(provider, calls) as string[]).filter((factory) => utils.isAddress(factory))

		const config = {
			address: manager.address,
			registry,
			factories: factoryAddresses,
			totalFactories: factoryAddresses.length
		}

		return new ManagerService(chainId, provider, config)
	}

	static async getFactory(provider: Provider, manager: string, factoryId: number) {
		const managerContract = IBeakerManager__factory.connect(manager, provider)

		return await managerContract.getProtocol(factoryId)
	}

	get address() {
		return this.config.address
	}

	get registry() {
		return this.config.registry
	}

	get factories() {
		return this.config.factories
	}

	get totalFactories() {
		return this.config.totalFactories
	}

	contract(signer?: Signer) {
		return IBeakerManager__factory.connect(this.address, signer ? signer : this.provider)
	}

	getFactory(factoryId: number) {
		return this.config.factories[factoryId]
	}
}
