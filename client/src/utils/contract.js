import { ethers } from "ethers";
import abi from "../contractABI/POP-ABI.json";

const CONTRACT_ADDRESS = "0x3f0f7682Ded761DaC1A0fa0bFe3f6EB5efFb1279"; // Replace with your contract address

export const getContractInstance = (provider) => {
  const signer = provider.getSigner();
  return new ethers.Contract(CONTRACT_ADDRESS, abi, signer);
};
