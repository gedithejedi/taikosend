'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import {
  getDefaultConfig,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { taikoHekla, taiko } from 'wagmi/chains';
import { projectId } from '@/utils/config'
import { AuthContextProviderProps } from './AuthContextProvider.type'

import '@rainbow-me/rainbowkit/styles.css';


const queryClient = new QueryClient()

if (!projectId) {
  throw new Error('Project ID is not defined')
}

export const walletConfig = getDefaultConfig({
  appName: 'Taikosend',
  projectId: projectId,
  chains: [taikoHekla, taiko],
  ssr: true,
  // transports: {
  //   [mainnet.id]: http('https://eth-mainnet.g.alchemy.com/v2/...'),
  //   [sepolia.id]: http('https://eth-sepolia.g.alchemy.com/v2/...'),
  // },
});

function ContextProvider({ children }: AuthContextProviderProps) {
  return (
    <WagmiProvider config={walletConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default ContextProvider