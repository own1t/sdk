import { BigNumber, BigNumberish, Signer, utils } from "ethers";

import { TokenService } from "./token";
import { Provider, ServiceInterfaces, TokenConfig } from "../types";

import { IWrappedNative__factory } from "../../typechain";

export class WrappedNativeService extends TokenService implements ServiceInterfaces.WrappedNative {

	constructor(
		chainId: number,
		provider: Provider,
		config: TokenConfig
	) {
		super(chainId, provider, config)
	}

	static async initialize(provider: Provider, address: string) {
		const chainId = provider.network.chainId

		const token = IWrappedNative__factory.connect(utils.getAddress(address), provider)

		const [name, symbol, decimals] = await Promise.all([
			token.name(),
			token.symbol(),
			token.decimals()
		])

		const config = {
			address: token.address,
			name,
			symbol,
			decimals
		}

		return new WrappedNativeService(chainId, provider, config)
	}

	contract(signer?: Signer) {
		return IWrappedNative__factory.connect(this.config.address, signer ? signer : this.provider)
	}

	async _deposit(value: BigNumberish) {
		if (!BigNumber.isBigNumber(value)) {
			value = this.parseUnits(value)
		}

		return await this.contract().populateTransaction.deposit({ value: value })
	}

	async _withdraw(value: BigNumberish) {
		if (!BigNumber.isBigNumber(value)) {
			value = this.parseUnits(value)
		}

		return await this.contract().populateTransaction.withdraw(value)
	}

	async deposit(value: BigNumberish, caller: string) {
		if (!BigNumber.isBigNumber(value)) {
			value = this.parseUnits(value)
		}

		const signer = this.getSigner(caller)
		const tx = await this.contract(signer).deposit({ value: value })
		return await tx.wait()
	}

	async withdraw(value: BigNumberish, caller: string) {
		if (!BigNumber.isBigNumber(value)) {
			value = this.parseUnits(value)
		}

		const signer = this.getSigner(caller)
		const tx = await this.contract(signer).withdraw(value)
		return await tx.wait()
	}
}
