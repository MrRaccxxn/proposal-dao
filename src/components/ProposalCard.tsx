'use client';

import { Proposal } from '@/lib/types';

interface ProposalCardProps {
  proposal: Proposal;
}

export const ProposalCard = ({ proposal }: ProposalCardProps) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors duration-200">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {proposal.title}
            </h3>
            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
              {proposal.description}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-2">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                <span className="text-indigo-600 text-sm font-medium">
                  {proposal.proposer.slice(0, 2).toUpperCase()}
                </span>
              </div>
            </div>
            <div className="text-sm">
              <p className="text-gray-900 font-medium">
                {proposal.proposer.slice(0, 6)}...{proposal.proposer.slice(-4)}
              </p>
              <p className="text-gray-500">Proposer</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 