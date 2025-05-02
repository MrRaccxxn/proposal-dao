"use client";

import { useEffect, useState } from 'react';
import { useGovernanceContract } from "@/hooks/useGovernanceContract";
import { ProposalCard } from "./ProposalCard";

export const ProposalList = () => {
  const { proposals, isLoading, error } = useGovernanceContract();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
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
      <div className="text-center p-6">
        <div className="text-red-500">Error loading proposals: {error}</div>
      </div>
    );
  }

  if (!proposals || proposals.length === 0) {
    return (
      <div className="text-center p-6">
        <p className="text-gray-500">No proposals yet. Be the first to create one!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Proposals</h2>
      <div className="grid gap-4">
        {proposals.map((proposal, index) => (
          <ProposalCard key={index} proposal={proposal} />
        ))}
      </div>
    </div>
  );
};
