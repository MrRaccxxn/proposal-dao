"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { useGovernanceContract } from "@/hooks/useGovernanceContract";
import { useAccount, useConnect } from "wagmi";
import { injected } from "wagmi/connectors";

export const ProposalForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const { submitProposal, isLoading, error } = useGovernanceContract();
  const { address } = useAccount();
  const { connect } = useConnect();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleConnect = () => {
    connect({ connector: injected() });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitProposal(title, description);
    setTitle("");
    setDescription("");
  };

  if (!isMounted) {
    return null;
  }

  if (!address) {
    return (
      <div className="text-center p-8 bg-gray-50 rounded-lg">
        <div className="mb-6">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Connect your wallet
        </h3>
        <p className="text-gray-500 mb-6">
          Connect your wallet to create and vote on proposals
        </p>
        <Button
          onClick={handleConnect}
          className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          Connect Wallet
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          Title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="Enter proposal title"
          required
          minLength={3}
          maxLength={100}
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="Describe your proposal in detail"
          rows={4}
          required
          minLength={10}
          maxLength={1000}
          disabled={isLoading}
        />
      </div>

      <div className="flex items-center justify-end">
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          {isLoading ? (
            <span className="flex items-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Creating...
            </span>
          ) : (
            'Create Proposal'
          )}
        </Button>
      </div>
    </form>
  );
};
