'use client';

import { useEffect, useState } from 'react';
import { useAccount, useChainId, useSwitchChain, useDisconnect } from 'wagmi';

const SEPOLIA_CHAIN_ID = 11155111;

interface NetworkCheckerProps {
  children: React.ReactNode;
}

export const NetworkChecker = ({ children }: NetworkCheckerProps) => {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const { disconnect } = useDisconnect();
  const [isMounted, setIsMounted] = useState(false);
  const [isModalDismissed, setIsModalDismissed] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Reset modal dismissed state when chain changes
  useEffect(() => {
    setIsModalDismissed(false);
  }, [chainId]);

  // This effect runs when the connection state or chain ID changes
  useEffect(() => {
    if (isConnected && chainId !== SEPOLIA_CHAIN_ID) {
      console.log(`Connected to non-Sepolia network (${chainId}). Prompting to switch.`);
    }
  }, [isConnected, chainId]);

  if (!isMounted) {
    return null;
  }

  const isSepoliaNetwork = chainId === SEPOLIA_CHAIN_ID;

  // If connected to a non-Sepolia network, show error and offer to disconnect or switch
  if (isConnected && !isSepoliaNetwork && !isModalDismissed) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full shadow-xl">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Wrong Network</h3>
            <p className="text-gray-600 mb-6">
              This application only works with the <span className="font-bold">Sepolia testnet</span>.
              <span className="block mt-2">
                Please switch networks or disconnect.
              </span>
            </p>
            
            <div className="flex flex-col space-y-3">
              <button
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                onClick={() => {
                  try {
                    switchChain({ chainId: SEPOLIA_CHAIN_ID });
                  } catch (error) {
                    console.error("Error switching chain:", error);
                  }
                }}
              >
                Switch to Sepolia
              </button>
              
              <button
                className="w-full bg-red-100 hover:bg-red-200 text-red-700 py-2 px-4 rounded-lg font-medium transition-colors"
                onClick={() => disconnect()}
              >
                Disconnect Wallet
              </button>
              
              <button
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg font-medium transition-colors"
                onClick={() => setIsModalDismissed(true)}
              >
                Proceed Anyway (Not Recommended)
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Always show a warning banner if not on Sepolia
  if (isConnected && !isSepoliaNetwork) {
    return (
      <>
        <div className="fixed top-0 left-0 right-0 bg-red-600 text-white p-3 text-center z-40 shadow-md">
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4">
            <span className="font-bold">⚠️ Warning: Wrong Network Detected</span>
            <span>This application only works with Sepolia testnet</span>
            <div className="flex space-x-2">
              <button 
                className="bg-white text-red-600 px-3 py-1 rounded-md text-sm font-medium hover:bg-red-50 transition-colors"
                onClick={() => switchChain({ chainId: SEPOLIA_CHAIN_ID })}
              >
                Switch to Sepolia
              </button>
              <button 
                className="bg-red-700 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-red-800 transition-colors"
                onClick={() => disconnect()}
              >
                Disconnect
              </button>
              <button 
                className="bg-red-700 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-red-800 transition-colors"
                onClick={() => setIsModalDismissed(false)}
              >
                Show Options
              </button>
            </div>
          </div>
        </div>
        <div className="pt-16 sm:pt-20">
          {children}
        </div>
      </>
    );
  }

  return <>{children}</>;
}; 