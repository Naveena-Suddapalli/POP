import React from 'react';
import { getMockContract } from '../utils/contractConfig';

const WalletConnect = ({ setAccount, setContract }) => {
  const connectWallet = () => {
    const mockAccount = '0xMockAccount1234567890abcdef';
    setAccount(mockAccount);

    const mockContract = getMockContract();
    setContract(mockContract);

    console.log('Mock wallet connected:', mockAccount);
  };

  return (
    <div>
      <button
        onClick={connectWallet}
        style={{
          backgroundColor: '#1e40af',
          color: 'white',
          padding: '0.5rem 1.5rem',
          border: 'none',
          borderRadius: '8px',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'background-color 0.3s',
        }}
        onMouseOver={(e) => (e.target.style.backgroundColor = '#1e3a8a')}
        onMouseOut={(e) => (e.target.style.backgroundColor = '#1e40af')}
      >
        Connect Wallet
      </button>
    </div>
  );
};

export default WalletConnect;