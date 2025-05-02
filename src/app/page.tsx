import { ProposalForm } from "@/components/ProposalForm";
import { ProposalList } from "@/components/ProposalList";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Governance Proposals
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Submit and view governance proposals for the community. Connect your wallet to participate.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Create Proposal
            </h2>
            <ProposalForm />
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Recent Proposals
            </h2>
            <ProposalList />
          </div>
        </div>
      </div>
    </main>
  );
}
