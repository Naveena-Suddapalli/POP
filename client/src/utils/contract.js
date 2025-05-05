/**
 * Contract Utility Module
 * Provides helper functions for smart contract interaction
 */

import { ethers } from "ethers";
import abi from "../contractABI/POP-ABI.json";

/** @dev Contract address on the blockchain */
const CONTRACT_ADDRESS = "0x3f0f7682Ded761DaC1A0fa0bFe3f6EB5efFb1279";

/**
 * Creates and returns a contract instance
 * @param {Object} provider - Web3 provider instance
 * @returns {Object} Contract instance with signer
 */
export const getContractInstance = (provider) => {
  const signer = provider.getSigner();
  return new ethers.Contract(CONTRACT_ADDRESS, abi, signer);
};
