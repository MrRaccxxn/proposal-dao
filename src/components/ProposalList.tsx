"use client";

import { useEffect, useState } from 'react';
import { useGovernanceContract } from "@/hooks/useGovernanceContract";
import { ProposalCard } from "./ProposalCard";
import { useChainId } from 'wagmi';

const SEPOLIA_CHAIN_ID = 11155111;

export const ProposalList = () => {
  const { proposals, isLoading, error } = useGovernanceContract();
  const [isMounted, setIsMounted] = useState(false);
  const chainId = useChainId();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const isSepoliaNetwork = chainId === SEPOLIA_CHAIN_ID;

  if (!isSepoliaNetwork) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 p-4 rounded-lg">
        <p className="font-medium">Network Error</p>
        <p>Please connect to Sepolia testnet to view proposals.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-center p-6">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-4">Loading proposals...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg">
        <p className="font-medium">Error loading proposals</p>
        <p>{error}</p>
      </div>
    );
  }

  if (!proposals || proposals.length === 0) {
    return (
      <div className="text-center p-6 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-gray-500">No proposals yet. Be the first to create one!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Proposals ({proposals.length})</h2>
      <div className="grid gap-4">
        {proposals.map((proposal, index) => (
          <ProposalCard key={index} proposal={proposal} />
        ))}
      </div>
    </div>
  );
};
