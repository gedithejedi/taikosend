// import { createConfig } from "wagmi";
// import { Chain as ViemChain, http } from "viem";
// import { base, mainnet, sepolia } from "viem/chains";

// export const chains: readonly [ViemChain, ...ViemChain[]] = [base, mainnet];

// export enum Chain {
//   MAINNET = 1,
//   BASE = 8453,
// }

// export const ChainSettings: Record<
//   Chain,
//   {
//     name: string;
//     color: string;
//   }
// > = {
//   [Chain.MAINNET]: {
//     name: "ETH Mainnet",
//     color: "#fff",
//   },
//   [Chain.BASE]: {
//     name: "Base",
//     color: "#3372fa",
//   },
// };

// export const config = createConfig({
//   chains,
//   transports: {
//     [mainnet.id]: http(),
//     [sepolia.id]: http(),
//     [base.id]: http(),
//   },
// });

// export const getExplorerTransactionUri = (chainId: number, address: string) => {
//   return `${chains.find(({ id }) => id === chainId)?.blockExplorers?.default.url}/tx/${address}`;
// };

// export const getExplorerAddressUri = (chainId: number, address: string) => {
//   return `${chains.find(({ id }) => id === chainId)?.blockExplorers?.default.url}/address/${address}`;
// };

// export const getChainName = (chainId: number) => {
//   return config.chains.find((c) => c.id === Number(chainId))?.name;
// };
