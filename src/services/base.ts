import { BigNumberish, constants, PopulatedTransaction as PopulatedTx, Signer, utils } from "ethers";

import { aggregate, getMulticall } from "../multicall";
import { MulticallParams, Provider } from "../types";

export abstract class BaseService {
	readonly chainId: number
	readonly provider: Provider

	constructor(chainId: number, provider: Provider) {
		this.chainId = chainId
		this.provider = provider
	}

	getSigner(signer: string): Signer {
		if (!utils.isAddress(signer) || signer === constants.AddressZero) throw new Error(`invalid signer: ${signer}`)

		return this.provider.getSigner(signer)
	}
}

export abstract class Service extends BaseService {
	calls: MulticallParams[] = []

	constructor(chainId: number, provider: Provider) {
		super(chainId, provider)
	}

	get multicall() {
		return getMulticall(this.provider)
	}

	static async aggregate(provider: Provider, calls: MulticallParams[], caller?: string) {
		return await aggregate(provider, calls, caller)
	}

	async sendTransaction(caller: string, unsignedTx: PopulatedTx) {
		const signer = this.getSigner(caller)

		const tx = await signer.sendTransaction(unsignedTx)

		return await tx.wait()
	}

	async aggregate(caller?: string) {
		const result = await aggregate(this.provider, this.calls, caller)

		this.calls = []

		return result
	}

	addCall(params: MulticallParams) {
		return this.calls.concat(params)
	}

	formatUnits(value: BigNumberish, unit?: number) {
		return parseFloat(utils.formatUnits(value, unit))
	}

	parseUnits(value: BigNumberish, unit?: number) {
		return utils.parseUnits(value.toString(), unit)
	}
}
