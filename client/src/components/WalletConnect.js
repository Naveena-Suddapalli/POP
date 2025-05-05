import React from 'react';
import { ethers } from 'ethers';
import { contractAddress, contractABI } from '../utils/contractConfig';

/**
 * WalletConnect Component
 * Handles MetaMask wallet connection and contract initialization
 * 
 * @param {Function} setAccount - Updates the connected account address
 * @param {Function} setContract - Updates the contract instance
 */
const WalletConnect = ({ setAccount, setContract }) => {
  /**
   * Connects to MetaMask wallet and initializes contract
   * 1. Requests account access
   * 2. Validates contract address
   * 3. Creates contract instance
   */
  const connectWallet = async () => {
    if (!contractAddress) {
      alert('Contract address not configured!');
      return;
    }

    if (window.ethereum) {
      try {
        // Request accounts from MetaMask
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const account = accounts[0];
        setAccount(account);

        // Validate contract address
        if (!ethers.utils.isAddress(contractAddress)) {
          throw new Error('Invalid contract address');
        }

        // Use Web3Provider to connect through MetaMask
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI, signer);
        setContract(contract);

        console.log('Wallet connected:', account);
      } catch (error) {
        console.error('Wallet connection error:', error);
        alert('Failed to connect wallet: ' + error.message);
      }
    } else {
      alert('Please install MetaMask!');
    }
  };

  return (
    <div className="wallet-connect">
      <button
        onClick={connectWallet}
        style={{
          backgroundColor: '#6d28d9',
          color: 'white',
        }}
      >
        Connect Wallet
      </button>
    </div>
  );
};

export default WalletConnect;