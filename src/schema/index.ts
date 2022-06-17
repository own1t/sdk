import { CHAIN_ID } from "../network";

import avalanche from "./avalanche.json";

export const schema = {
	[CHAIN_ID.AVALANCHE]: JSON.parse(JSON.stringify(avalanche)),
}
