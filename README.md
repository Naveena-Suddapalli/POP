# Proof of Presence (PoP) 

> Secure, soulbound NFT-based event attendance verification system built on Ethereum

## Demo & Links

- **Live Demo**
  - [Organizer Dashboard](https://pop-xi-virid.vercel.app/organizer)
  - [Attendee Dashboard](https://pop-xi-virid.vercel.app/attendee)
- [Video Tutorial](https://youtu.be/i3aLl_BxqFk)
- [GitHub Repository](https://github.com/Naveena-Suddapalli/POP)

## Features

### Organizer Dashboard
- Create time-bound events on-chain with unique IDs
- Set event schedules and details
- Real-time UI updates for event management

### Attendee Dashboard
- MetaMask wallet integration
- Event check-in during valid time windows
- Mint non-transferable (soulbound) ERC-721 NFTs
- IPFS metadata pinning via Pinata
- View and manage attendance NFT collection

## Tech Stack

- **Smart Contract:** Solidity (POP.sol), ERC-721 soulbound
- **Frontend:** React, Ethers.js
- **Storage:** IPFS via Pinata
- **Blockchain:** Ethereum (Sepolia Testnet)
- **Wallet:** MetaMask
- **Deployment:** Vercel
- **Styling:** Tailwind-inspired CSS

## Prerequisites

- Node.js (v16+) and npm
- MetaMask browser extension
- Sepolia testnet connection
- (Optional) Pinata account for IPFS

## Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/Naveena-Suddapalli/POP.git
   cd proof-of-presence
   ```

2. **Install dependencies**
   ```bash
   cd client
   npm install
   ```

3. **Deploy Smart Contract**
   - Open `SmartContract/POP.sol` in Remix/Hardhat
   - Compile with Solidity ^0.8.19
   - Deploy to Sepolia
   - Copy contract address and ABI

4. **Launch Application**
   ```bash
   npm start
   ```
   Visit http://localhost:3000 and connect MetaMask