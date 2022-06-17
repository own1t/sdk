import chalk from "chalk";
import { expect, use } from "chai";
import { ethers } from "hardhat";
import { BigNumber, constants, utils } from "ethers";
import { solidity } from "ethereum-waffle";

import { Beaker, TokenService } from "../src";
import { CHAIN_ID } from "../src/network";
import { switchChains } from "./utils";

import { schema } from "../src/schema"

use(solidity)


describe("TokenService", () => {
	let chainId: number
	let sdk: Beaker
	let tokenService: TokenService
	let blockNumber: number

	before(async () => {

		let chainId = CHAIN_ID.AVALANCHE

		await switchChains(chainId)

		sdk = new Beaker(ethers.provider, schema[chainId])
		tokenService = sdk.services.tokens[0]
	})

	it(`should initialize token service with schema`, async () => {
		const token = {
			address: "0x1337BedC9D22ecbe766dF105c9623922A27963EC",
			name: "Curve.fi avDAI/avUSDC/avUSDT",
			symbol: "av3CRV",
			decimals: 18
		}

		const holder = "0x5B5CFE992AdAC0C9D48E05854B2d91C73a003858"

		const tokenContract = tokenService.contract()
		const tokenAddress = tokenService.address
		const tokenName = tokenService.name
		const tokenSymbol = tokenService.symbol
		const tokenDecimals = tokenService.decimals
		const tokenBalance = await tokenService.balanceOf(holder)

		expect(tokenAddress).to.be.eq(token.address)
		expect(tokenName).to.be.eq(token.name)
		expect(tokenSymbol).to.be.eq(token.symbol)
		expect(tokenDecimals).to.be.eq(token.decimals)
		expect(tokenBalance).to.be.gt(constants.Zero)
	})

	it(`should initialize token service without schema`, async () => {
		const token = {
			address: "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7",
			name: "Wrapped AVAX",
			symbol: "WAVAX",
			decimals: 18
		}

		const holder = "0xf4003F4efBE8691B60249E6afbD307aBE7758adb"

		const service = await TokenService.initialize(ethers.provider, token.address)
		const tokenContract = service.contract()
		const tokenAddress = service.address
		const tokenName = service.name
		const tokenSymbol = service.symbol
		const tokenDecimals = service.decimals
		const tokenBalance = await service.balanceOf(holder)

		expect(tokenAddress).to.be.eq(token.address)
		expect(tokenName).to.be.eq(token.name)
		expect(tokenSymbol).to.be.eq(token.symbol)
		expect(tokenDecimals).to.be.eq(token.decimals)
		expect(tokenBalance).to.be.gt(constants.Zero)
	})
})
