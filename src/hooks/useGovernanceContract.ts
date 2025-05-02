"use client";

import {
  useAccount,
  useReadContracts,
  useWriteContract,
  useWatchContractEvent,
} from "wagmi";
import { useState, useEffect } from "react";
import { CONTRACT_CONFIG } from "../../blockchain/config";

interface RawProposal {
  title: string;
  description: string;
  proposer: string;
}

export function useGovernanceContract() {
  const { address } = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Read contract data with specific configuration to prevent issues
  const { 
    data: contractData, 
    refetch: refetchProposals,
    error: readError 
  } = useReadContracts({
    contracts: [
      {
        ...CONTRACT_CONFIG,
        functionName: "getProposalCount",
      },
      {
        ...CONTRACT_CONFIG,
        functionName: "getAllProposals",
      },
    ],
    query: {
      // Ensure proper refetching and caching behavior
      refetchInterval: 10000, // Refetch every 10 seconds
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      retry: 3
    }
  });

  // Handle contract read errors
  useEffect(() => {
    if (readError) {
      console.error("Contract read error:", readError);
      setError(`Error loading proposals: ${readError.message}`);
    } else {
      setError(null);
    }
  }, [readError]);

  const proposalCount = contractData?.[0]?.result
    ? Number(contractData[0].result)
    : 0;
  const proposals = contractData?.[1]?.result as RawProposal[] | undefined;

  // Create proposal
  const { writeContract } = useWriteContract();

  // Watch for events
  useWatchContractEvent({
    ...CONTRACT_CONFIG,
    eventName: "ProposalCreated",
    onLogs() {
      console.log("New proposal created, refreshing...");
      refetchProposals();
      setIsLoading(false);
      setError(null);
    },
  });

  // Submit proposal
  const submitProposal = async (title: string, description: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log("Submitting proposal:", title, description);
      console.log("Contract address:", CONTRACT_CONFIG.address);
      
      await writeContract({
        ...CONTRACT_CONFIG,
        functionName: "createProposal",
        args: [title, description],
      });
      
      // Note: Loading state will be cleared by the event listener
    } catch (err) {
      const error = err as Error;
      console.error("Error creating proposal:", error);
      setError(error.message || "Failed to create proposal");
      setIsLoading(false);
    }
  };

  return {
    proposals: proposals?.map((proposal) => ({
      title: proposal.title,
      description: proposal.description,
      proposer: proposal.proposer,
    })),
    proposalCount,
    submitProposal,
    isLoading,
    error,
    address,
  };
}
