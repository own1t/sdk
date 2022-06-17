import { NETWORK } from "./network";
import * as Services from "./services"
import { FactoryConfig as _FactoryConfig, Provider, TokenConfig, VaultConfig } from "./types";

type ServiceType = {
	manager: Services.ManagerService
	factories: Services.FactoryService[]
	tokens: Services.TokenService[]
	vaults: Services.VaultService[]
	wrappedNative: Services.WrappedNativeService
}

interface FactoryConfig extends Omit<_FactoryConfig, "vaults"> {
	vaults: VaultConfig[]
}

interface BeakerConfig {
	readonly chainId: number
	readonly network: string
	readonly manager: string
	readonly registry: string
	readonly factories: FactoryConfig[]
}

export class Beaker {
	services: ServiceType

	constructor(provider: Provider, config: BeakerConfig) {
		this.services = this.initServices(provider, config)
	}

	static async initialize(provider: Provider, managerAddress: string) {
		const chainId = provider.network.chainId

	}

	initServices(provider: Provider, config: BeakerConfig) {
		const chainId = config.chainId
		const factoryConfig = config.factories
		const vaultConfig = config.factories.flatMap((factory) => factory.vaults)
		const tokenConfig = vaultConfig.map((vault) => vault.underlying)

		return {
			manager: new Services.ManagerService(
				chainId,
				provider,
				{
					address: config.manager,
					registry: config.registry,
					factories: config.factories.map((factory) => factory.address),
					totalFactories: config.factories.length
				}
			),
			factories: factoryConfig.map((factory) =>
				new Services.FactoryService(
					chainId,
					provider,
					{
						id: factory.id,
						address: factory.address,
						vaults: factory.vaults.map((vault) => vault.address),
						totalVaults: factory.vaults.length
					}
				)
			),
			vaults: vaultConfig.map((vault) =>
				new Services.VaultService(
					chainId,
					provider,
					{
						id: vault.id,
						address: vault.address,
						name: vault.name,
						symbol: vault.symbol,
						decimals: vault.decimals,
						factory: vault.factory,
						strategy: vault.strategy,
						underlying: vault.underlying
					}
				)
			),
			tokens: tokenConfig.map((token) =>
				new Services.TokenService(
					chainId,
					provider,
					{
						address: token.address,
						name: token.name,
						symbol: token.symbol,
						decimals: token.decimals
					}
				)
			),
			wrappedNative: new Services.WrappedNativeService(
				chainId,
				provider,
				Object.entries(NETWORK)
					.map(([_, network]) => network.wrappedNative)
					.find((network) => network.chainId === chainId) as TokenConfig
			)
		}
	}
}