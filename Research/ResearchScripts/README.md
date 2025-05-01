# NFT Mint & Attendance Event Analyzer (Ethereum + Solana)

This project performs NFT mint and transfer log analysis from two major blockchains – **Ethereum** and **Solana** – specifically targeting attendance-based NFT systems.

- On **Ethereum**, we focus on the [POAP (Proof of Attendance Protocol)](https://poap.xyz/) contract – where each NFT represents attendance to an event.
- On **Solana**, we query a creator-based NFT set from Metaplex that was intended for similar pop attendance-based event NFTs.

Both chains are analyzed via public APIs, and data is exported to CSV and summarized with charts and metrics.

---

## Project Structure

```
ResearchScripts/
├── data/
│   ├── eth_logs.csv              # Raw Ethereum logs (mints/transfers)
│   ├── eth_summary.json          # Computed Ethereum stats
├── scripts/
│   ├── fetchEthMints.js          # Ethereum mint & transfer fetcher
│   ├── analyzeEthMints.js        # Ethereum log analyzer and summarizer
│   └── fetchSolanaMints.js       # Solana NFT fetcher using Metaplex API
├── .env                          # Optional config for RPC keys
├── package.json                  # Project dependencies
```

---

## Features

### Ethereum (POAP Attendance NFTs)
- Fetches `Transfer` events from POAP contract (`0x22C1f6050E56d2876009903609a2cC3fEf83B415`)
- Classifies logs as `MINT` vs `TRANSFER`
- Computes:
  - Total POAP NFTs minted
  - Unique attendees (wallets)
  - Gas usage & fees
  - Mint duration & latency
  - Busiest day for POAP events
- Outputs CSV logs + JSON stats + CLI bar chart

### Solana (POP-type Attendance NFTs)
- Queries NFTs by creator from Metaplex Read API
- Extracts `mint address`, `name`, `update authority`, and `event date`
- No statistical summary due to sparse mint activity

---

## Setup Instructions

1. **Clone the Repository**
```bash
git clone https://github.com/Naveena-Suddapalli/POP.git
cd POP/Research/ResearchScripts
```

2. **Install Dependencies**
```bash
npm install
```

3. **Configure `.env`**
```env
RPC_URL=https://eth-mainnet.g.alchemy.com/v2/YOUR_API_KEY
```

---

## Ethereum Analysis

### Step 1: Fetch Logs
```bash
node scripts/fetchEthMints.js
```
Output: `data/eth_logs.csv`

### Step 2: Analyze Logs
```bash
node scripts/analyzeEthMints.js
```
Output: `data/eth_summary.json`

### Sample eth_summary.json Output
```json
{
  "totalMints": 36868,
  "uniqueWallets": 29561,
  "topReceiver": "0x77f18...cfa4",
  "busiestDay": "2022-08-03",
  "gas": {
    "totalGas": 3281734312,
    "avgGas": 89111,
    "minGas": 67000,
    "maxGas": 112934
  },
  "fees": {
    "totalFeesInETH": "4.821377",
    "averageFeePerMintInETH": "0.000131"
  },
  "timing": {
    "firstMint": "2022-07-30T04:12:23.000Z",
    "lastMint": "2022-08-07T10:03:41.000Z",
    "latencyPerMintSeconds": "17.86"
  }
}
```

---

## Solana NFT Exploration

Fetches attendance-style NFTs by a Solana creator address via the Metaplex Read API.

```bash
node scripts/fetchSolanaMints.js
```

> Although NFT metadata was fetched, the dataset lacked significant mint activity, so no further analytics were generated.

---

## Tech Stack

- **Node.js**
- **ethers.js** – Ethereum integration
- **csv-writer**, **csv-parser** – Data handling
- **cli-chart** – In-terminal visuals
- **Alchemy API** – Ethereum RPC
- **Metaplex Read API** – Solana GraphQL endpoint

---

## Future Work

- Expand Solana analysis for more event types
- If a popular POAP-like attendance NFT project emerges on Solana, this framework can be expanded to fetch its mint data and enable cross-chain analysis against Ethereum POAP stats.

---

## Contributors

- Shriya Akula
- Naveena Suddapalli
---

## License

MIT – open source, modify and share freely.

---

## Contact

Have questions? [Open an issue](https://github.com/Naveena-Suddapalli/issues) or ping us directly.