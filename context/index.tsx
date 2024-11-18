'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createAppKit } from '@reown/appkit/react'
import { taikoHekla } from '@reown/appkit/networks'
import React, { ReactNode } from 'react'
import { cookieToInitialState, WagmiProvider, type Config } from 'wagmi'
import { projectId, wagmiAdapter } from '../utils/config'

// Set up queryClient
const queryClient = new QueryClient()

if (!projectId) {
  throw new Error('Project ID is not defined')
}

// Set up metadata
const metadata = {
  name: 'taikosend',
  description: 'Send tokens to multiple addresses in one transaction',
  url: 'https://taikosend.vercel.app/', // origin must match your domain & subdomain
  icons: ['https://hekla.taikoscan.io/assets/generic/html/favicon.ico']
}

createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [taikoHekla],
  defaultNetwork: taikoHekla,
  metadata: metadata,
  features: {
    swaps: false,
    onramp: false,
    legalCheckbox: false,
    email: false,
    socials: false,
  }
})

function ContextProvider({ children, cookies }: { children: ReactNode; cookies: string | null }) {
  const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig as Config, cookies)

  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig as Config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}

export default ContextProvider