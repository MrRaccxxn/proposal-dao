export interface Proposal {
  title: string;
  description: string;
  proposer: string;
}

export interface CreateProposalParams {
  title: string;
  description: string;
}

export interface GovernanceContract {
  createProposal: (params: CreateProposalParams) => Promise<void>;
  getAllProposals: () => Promise<Proposal[]>;
  getProposalCount: () => Promise<number>;
}
