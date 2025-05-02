"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { ReactNode } from "react";
import { config } from "@/lib/wagmi";
import { NetworkChecker } from "@/components/NetworkChecker";

const queryClient = new QueryClient();

export function Providers({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <NetworkChecker>{children}</NetworkChecker>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
