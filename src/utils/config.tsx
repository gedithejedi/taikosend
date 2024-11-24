import { taikoHekla, taiko } from 'wagmi/chains';

export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID

if (!projectId) {
  throw new Error('Project ID is not defined')
}

export const networks = [taikoHekla]

export enum Chain {
  Mainnet = 167000,
  Hekla = 167009
}