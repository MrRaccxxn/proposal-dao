"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { useGovernanceContract } from "@/hooks/useGovernanceContract";
import { useAccount, useConnect, useChainId, useSwitchChain, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";

const SEPOLIA_CHAIN_ID = 11155111;

export const ProposalForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [connectError, setConnectError] = useState<string | null>(null);
  const { submitProposal, isLoading, error } = useGovernanceContract();
  const { address } = useAccount();
  const { connect, isPending } = useConnect();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const { disconnect } = useDisconnect();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleConnect = async () => {
    setConnectError(null);
    
    try {
      // Check if the user already has MetaMask installed
      if (typeof window !== 'undefined' && window.ethereum) {
        // Get the current chain ID
        const currentChainId = await window.ethereum.request({ method: 'eth_chainId' });
        
        // Convert hex to decimal
        const decimalChainId = parseInt(currentChainId, 16);
        
        if (decimalChainId !== SEPOLIA_CHAIN_ID) {
          try {
            // Try to switch to Sepolia
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: `0x${SEPOLIA_CHAIN_ID.toString(16)}` }],
            });
            
            // After switching, connect
            connect({ 
              connector: injected()
            });
          } catch (switchError: unknown) {
            // If the chain is not added to MetaMask, suggest adding it
            if (switchError && typeof switchError === 'object' && 'code' in switchError && switchError.code === 4902) {
              try {
                await window.ethereum.request({
                  method: 'wallet_addEthereumChain',
                  params: [
                    {
                      chainId: `0x${SEPOLIA_CHAIN_ID.toString(16)}`,
                      chainName: 'Sepolia Testnet',
                      nativeCurrency: {
                        name: 'Sepolia Ether',
                        symbol: 'ETH',
                        decimals: 18,
                      },
                      rpcUrls: ['https://rpc.sepolia.org'],
                      blockExplorerUrls: ['https://sepolia.etherscan.io'],
                    },
                  ],
                });
                
                // After adding, connect
                connect({ 
                  connector: injected()
                });
              } catch {
                setConnectError('Could not add Sepolia network to your wallet. Please add it manually.');
              }
            } else {
              setConnectError('Could not switch to Sepolia network. Please switch manually before connecting.');
            }
          }
        } else {
          // Already on Sepolia, just connect
          connect({ 
            connector: injected()
          });
        }
      } else {
        // No MetaMask
        setConnectError('MetaMask not detected. Please install MetaMask to use this application.');
      }
    } catch (error) {
      console.error('Connection error:', error);
      setConnectError('Error connecting to wallet. Please try again.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (chainId !== SEPOLIA_CHAIN_ID) {
      alert("Please connect to Sepolia network before submitting a proposal.");
      return;
    }
    
    await submitProposal(title, description);
    setTitle('');
    setDescription('');
  };

  const handleSwitchNetwork = () => {
    try {
      switchChain({ chainId: SEPOLIA_CHAIN_ID });
    } catch (error) {
      console.error("Error switching chain:", error);
    }
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
          Connect to Sepolia Network
        </h3>
        <p className="text-gray-500 mb-6">
          This application only works with the Sepolia testnet. Connecting will automatically switch your network.
        </p>
        
        {connectError && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg mb-4 text-sm">
            {connectError}
          </div>
        )}
        
        <Button
          onClick={handleConnect}
          disabled={isPending}
          className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          {isPending ? (
            <span className="flex items-center justify-center">
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
              Connecting...
            </span>
          ) : (
            "Connect to Sepolia"
          )}
        </Button>
      </div>
    );
  }

  const isSepoliaNetwork = chainId === SEPOLIA_CHAIN_ID;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {!isSepoliaNetwork && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
            <div className="mb-2 sm:mb-0">
              <p className="font-semibold">Wrong Network</p>
              <p>You&apos;re currently connected to the wrong network.</p>
            </div>
            <div className="flex space-x-2">
              <Button
                type="button"
                onClick={handleSwitchNetwork}
                className="bg-yellow-600 hover:bg-yellow-700 text-white"
              >
                Switch to Sepolia
              </Button>
              <Button
                type="button"
                onClick={() => disconnect()}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800"
              >
                Disconnect
              </Button>
            </div>
          </div>
        </div>
      )}

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
          disabled={isLoading || !isSepoliaNetwork}
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
          disabled={isLoading || !isSepoliaNetwork}
        />
      </div>

      <div className="flex items-center justify-end">
        <Button
          type="submit"
          disabled={isLoading || !isSepoliaNetwork}
          className={`${
            isSepoliaNetwork 
              ? "bg-indigo-600 hover:bg-indigo-700"
              : "bg-gray-400 cursor-not-allowed"
          } text-white`}
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
          ) : !isSepoliaNetwork ? (
            "Connect to Sepolia"
          ) : (
            "Create Proposal"
          )}
        </Button>
      </div>
    </form>
  );
};
