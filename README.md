# 🗳️ Governance Proposal dApp

A simple decentralized application that allows users to submit and view governance proposals. Built with **Next.js**, **TypeScript**, and **Wagmi**, and connected to an Ethereum smart contract deployed on the **Sepolia** testnet.

---

## 🧩 Features

- ✅ Connect wallet using Wagmi
- 📝 Submit new proposals (title + description)
- 📃 View a list of all submitted proposals
- 🔗 Interact with a real smart contract on Sepolia

---

## ⚙️ Smart Contract

- **Network**: Sepolia Testnet
- **Contract Address**: [`0x755573Ab9248C6B19F56E6B9e2285851e8d02dc3`](https://sepolia.etherscan.io/address/0x755573Ab9248C6B19F56E6B9e2285851e8d02dc3)
- **Explorer**: View contract code and transactions on Etherscan
- The contract allows anyone to:
  - Create a proposal (with title and description)
  - Retrieve all proposals (publicly accessible)

---

## 🛠️ How to Run Locally

1. **Clone the repository**
   ```bash
   git clone <repo_url>
   cd <project_folder>
   npm install
   npm run dev
   ```
2. **Visit http://localhost:3000**

📝 No environment variables are required — the app uses a public RPC from Sepolia to connect to the smart contract.
