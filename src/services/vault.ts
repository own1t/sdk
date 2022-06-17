import { BigNumber, BigNumberish, Signer, utils } from "ethers";

import { TokenService } from "./token";
import { Provider, ServiceInterfaces, VaultConfig } from "../types";

import { IBeaker__factory, IERC20Metadata__factory } from "../../typechain";


export class VaultService extends TokenService implements ServiceInterfaces.Vault {
	readonly config: VaultConfig

	constructor(
		chainId: number,
		provider: Provider,
		config: VaultConfig
	) {
		const baseConfig = {
			address: config.address,
			name: config.name,
			symbol: config.symbol,
			decimals: config.decimals
		}

		super(chainId, provider, baseConfig)

		this.config = config
	}

	static async initialize(provider: Provider, address: string) {
		const chainId = provider.network.chainId

		const vault = IBeaker__factory.connect(utils.getAddress(address), provider)

		const [
			id,
			name,
			symbol,
			decimals,
			factory,
			strategy,
			underlying
		] = await Promise.all([
			vault.vaultId(),
			vault.name(),
			vault.symbol(),
			vault.decimals(),
			vault.factory(),
			vault.strategy(),
			vault.asset()
		])

		const underlyingContract = IERC20Metadata__factory.connect(underlying, provider)

		const [
			underlyingName,
			underlyingSymbol,
			underlyingDecimals
		] = await Promise.all([
			underlyingContract.name(),
			underlyingContract.symbol(),
			underlyingContract.decimals(),
		])

		const underlyingConfig = {
			address: underlying,
			name: underlyingName,
			symbol: underlyingSymbol,
			decimals: underlyingDecimals
		}

		const config = {
			id,
			address: vault.address,
			name,
			symbol,
			decimals,
			factory,
			strategy,
			underlying: underlyingConfig
		}

		return new VaultService(chainId, provider, config)
	}

	get id() {
		return this.config.id
	}

	get factory() {
		return this.config.factory
	}

	get strategy() {
		return this.config.strategy
	}

	get underlying() {
		return this.config.underlying
	}

	contract(signer?: Signer) {
		return IBeaker__factory.connect(this.address, signer ? signer : this.provider)
	}

	async _totalAssets() {
		return {
			to: this.address,
			data: this.contract().interface.encodeFunctionData("totalAssets")
		}
	}

	async _totalValues() {
		return {
			to: this.address,
			data: this.contract().interface.encodeFunctionData("totalValues")
		}
	}

	async totalAssets() {
		return await this.contract().totalAssets()
	}

	async totalValues() {
		return await this.contract().totalValues()
	}
}
