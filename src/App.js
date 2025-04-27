import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import WalletConnect from './components/WalletConnect';
import EventCheckIn from './components/EventCheckIn';
import AttendanceNFTs from './components/AttendanceNFTs';
import CreateEvent from './components/CreateEvent';
import './App.css';

function App() {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);

  return (
    <Router>
      <div className="app-container">
        {/* Header */}
        <header className="app-header">
          <div className="header-content">
            <div className="header-logo">
              {/* Removed the image */}
              <h1>Proof of Presence</h1>
            </div>
            <p>Securely verify event attendance with blockchain technology.</p>
            <nav className="header-nav">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive ? "nav-link nav-link-attendee nav-link-active" : "nav-link nav-link-attendee"
                }
              >
                Attendee Dashboard
              </NavLink>
              <NavLink
                to="/organizer"
                className={({ isActive }) =>
                  isActive ? "nav-link nav-link-organizer nav-link-active" : "nav-link nav-link-organizer"
                }
              >
                Organizer Dashboard
              </NavLink>
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main className="app-main">
          {/* Wallet Section */}
          <section className="wallet-section">
            <WalletConnect setAccount={setAccount} setContract={setContract} />
            {account && (
              <p className="connected-account">
                Connected: {account.slice(0, 6)}...{account.slice(-4)}
              </p>
            )}
          </section>

          {/* Routes */}
          <Routes>
            {/* Attendee Dashboard */}
            <Route
              path="/"
              element={
                <>
                  <section className="checkin-section">
                    <EventCheckIn contract={contract} account={account} />
                  </section>
                  <section className="nft-section">
                    <AttendanceNFTs contract={contract} account={account} />
                  </section>
                </>
              }
            />
            {/* Organizer Dashboard */}
            <Route
              path="/organizer"
              element={
                <section className="create-event-section">
                  <CreateEvent contract={contract} account={account} />
                </section>
              }
            />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="app-footer">
          <p>© 2025 Proof of Presence. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
