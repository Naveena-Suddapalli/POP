import React, { useState } from 'react'; // Ensure useState is imported
import WalletConnect from './components/WalletConnect';
import EventCheckIn from './components/EventCheckIn';
import AttendanceNFTs from './components/AttendanceNFTs';
import './App.css';

function App() {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Proof of Presence</h1>
      </header>
      <main className="app-main">
        <section className="wallet-section">
          <WalletConnect setAccount={setAccount} setContract={setContract} />
          {account && (
            <p className="connected-account">
              Connected: {account.slice(0, 6)}...{account.slice(-4)}
            </p>
          )}
        </section>
        <section className="checkin-section">
          <EventCheckIn contract={contract} account={account} />
        </section>
        <section className="nft-section">
          <AttendanceNFTs contract={contract} account={account} />
        </section>
      </main>
      <footer className="app-footer">
        <p>© 2025 Proof of Presence. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;