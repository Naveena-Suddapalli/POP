# Proof of Presence
A decentralized event attendance verification system using Ethereum, IPFS, and Soulbound Tokens.

## Setup
- Open [Remix IDE](https://remix.ethereum.org).
- Compile with Solidity 0.8.20.
- Deploy on Remix VM or Polygon Mumbai.

## Status
- Compiled with warnings:
  - Unreachable code in OpenZeppelin ERC721.
  - `_transfer` mutability can be `pure`.
- Deployed in Remix VM (Cancun), hash: 0x989...94c6e.
- `createEvent` reverted due to timestamp mismatch; adjusting timestamps.