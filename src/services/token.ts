import { BigNumber, BigNumberish, Signer, utils } from "ethers";

import { Service } from "./base";
import { MulticallParams, Provider, ServiceInterfaces, TokenConfig } from "../types";

import { IERC20Metadata__factory } from "../../typechain";

export class TokenService extends Service implements ServiceInterfaces.Token {
	readonly config: TokenConfig

	constructor(
		chainId: number,
		provider: Provider,
		config: TokenConfig
	) {
		super(chainId, provider)

		this.config = config
	}

	static async initialize(provider: Provider, address: string) {
		const chainId = provider.network.chainId

		const token = IERC20Metadata__factory.connect(utils.getAddress(address), provider)

		// const [name, symbol, decimals] = await Promise.all([
		// 	token.name(),
		// 	token.symbol(),
		// 	token.decimals()
		// ])

		const unsignedTxs = await Promise.all([
			await token.populateTransaction.name(),
			await token.populateTransaction.symbol(),
			await token.populateTransaction.decimals()
		])

		const calls: MulticallParams[] = unsignedTxs.map((tx) => ({
			allowFailure: true,
			contract: token,
			unsignedTx: tx
		}))

		const [name, symbol, decimals] = await Service.aggregate(provider, calls) as [string, string, number]

		const config = {
			address: token.address,
			name,
			symbol,
			decimals
		}

		return new TokenService(chainId, provider, config)
	}

	get address(): string {
		return this.config.address
	}

	get name(): string {
		return this.config.name
	}

	get symbol(): string {
		return this.config.symbol
	}

	get decimals(): number {
		return this.config.decimals
	}

	contract(signer?: Signer) {
		return IERC20Metadata__factory.connect(this.config.address, signer ? signer : this.provider)
	}

	_allowance(owner: string, spender: string) {
		return {
			to: this.address,
			data: this.contract().interface.encodeFunctionData("allowance", [owner, spender])
		}
	}

	_balanceOf(account: string) {
		return {
			to: this.address,
			data: this.contract().interface.encodeFunctionData("balanceOf", [account])
		}
	}

	async _approve(spender: string, value: BigNumberish) {
		if (!BigNumber.isBigNumber(value)) {
			value = this.parseUnits(value, this.decimals)
		}

		return await this.contract().populateTransaction.approve(spender, value)
	}

	async _transfer(recipient: string, value: BigNumberish) {
		if (!BigNumber.isBigNumber(value)) {
			value = this.parseUnits(value, this.decimals)
		}

		return await this.contract().populateTransaction.transfer(recipient, value)
	}

	async _transferFrom(sender: string, recipient: string, value: BigNumberish) {
		if (!BigNumber.isBigNumber(value)) {
			value = this.parseUnits(value, this.decimals)
		}

		return await this.contract().populateTransaction.transferFrom(sender, recipient, value)
	}

	async allowance(owner: string, spender: string) {
		return this.contract().allowance(owner, spender)
	}

	async balanceOf(account: string) {
		return this.contract().balanceOf(account)
	}

	async approve(spender: string, value: BigNumberish, caller: string) {
		if (!BigNumber.isBigNumber(value)) {
			value = this.parseUnits(value, this.decimals)
		}

		const signer = this.getSigner(caller)

		const tx = await this.contract(signer).approve(spender, value)

		return await tx.wait()
	}

	async transfer(recipient: string, value: BigNumberish, caller: string) {
		if (!BigNumber.isBigNumber(value)) {
			value = this.parseUnits(value, this.decimals)
		}

		const signer = this.getSigner(caller)

		const tx = await this.contract(signer).transfer(recipient, value)

		return await tx.wait()
	}

	async transferFrom(recipient: string, value: BigNumberish, caller: string) {
		if (!BigNumber.isBigNumber(value)) {
			value = this.parseUnits(value, this.decimals)
		}

		const signer = this.getSigner(caller)

		const tx = await this.contract(signer).transferFrom(caller, recipient, value)

		return await tx.wait()
	}
}
