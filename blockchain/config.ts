import { sepolia } from "wagmi/chains";
import { GOVERNANCE_ABI } from "./abi";

export const CHAIN = sepolia;

export const CONTRACT_CONFIG = {
  address: "0x755573Ab9248C6B19F56E6B9e2285851e8d02dc3" as `0x${string}`, // Replace with actual contract address
  abi: GOVERNANCE_ABI,
} as const;
