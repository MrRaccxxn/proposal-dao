"use client";

import {
  useAccount,
  useReadContracts,
  useWriteContract,
  useWatchContractEvent,
} from "wagmi";
import { useState } from "react";
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

  // Read contract data
  const { data: contractData, refetch: refetchProposals } = useReadContracts({
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
  });

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
      await writeContract({
        ...CONTRACT_CONFIG,
        functionName: "createProposal",
        args: [title, description],
      });
    } catch (err) {
      const error = err as Error;
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
