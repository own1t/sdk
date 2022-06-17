import { BigNumber, BytesLike, constants } from "ethers";

import { MulticallParams, Provider } from "./types";

import { IMulticall3__factory } from "../typechain";


export const MULTICALL3_ADDRESS = "0xcA11bde05977b3631167028862bE2a173976CA11"

export const getMulticall = (provider: Provider) => {
	return IMulticall3__factory.connect(MULTICALL3_ADDRESS, provider)
}

export const aggregate = async (provider: Provider, calls: MulticallParams[], caller?: string) => {
	const multicall = getMulticall(provider)

	if (!caller) {
		const inputs = calls.map((call) => {

			const utx = call.unsignedTx

			if (!utx.to || !utx.data) throw new Error(`invalid tx data: ${utx}`)

			return {
				allowFailure: call.allowFailure,
				target: utx.to,
				callData: utx.data
			}
		})

		const outputs: { success: boolean, returnData: BytesLike }[] = await multicall.callStatic.aggregate3(inputs)

		return outputs.map(({ success, returnData }) => {

			const call = calls.shift() as MulticallParams

			if (!success) return null

			try {
				const itf = call.contract.interface
				const utx = call.unsignedTx
				const signature = utx.data?.substring(0, 10) as string
				const decodedData = itf.decodeFunctionResult(signature, returnData)

				return decodedData.length > 1
					? decodedData
					: decodedData[0]
			} catch {
				return null
			}
		})
	}

	const valueAccumulator = calls
		.map((call) => call.unsignedTx.value)
		.reduce((acc: BigNumber, value: BigNumber | undefined) => value ? acc.add(value) : acc, constants.Zero)

	const inputs = calls.map((call) => {

		const utx = call.unsignedTx

		if (!utx.to || !utx.data) throw new Error(`invalid tx data: ${utx}`)

		return {
			allowFailure: call.allowFailure,
			target: utx.to,
			value: utx.value ?? constants.Zero,
			callData: utx.data
		}
	})

	const signer = provider.getSigner(caller)

	return valueAccumulator.isZero()
		? await multicall.connect(signer).aggregate3(inputs)
		: await multicall.connect(signer).aggregate3Value(inputs, { value: valueAccumulator })

	// return await multicall.connect(signer).aggregate3Value(inputs, { value: valueAccumulator })
}
