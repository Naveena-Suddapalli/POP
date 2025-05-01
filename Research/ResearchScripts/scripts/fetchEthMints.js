const { ethers, getAddress } = require("ethers");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

// ==== CONFIG ====
const RPC_URL = "https://eth-mainnet.g.alchemy.com/v2/p2PdEXnut98vKwj16Qfuv3IUG7hClh1d";
const CONTRACT_ADDRESS = getAddress("0x22C1f6050E56d2876009903609a2cC3fEf83B415"); // POAP contract
const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
const START_BLOCK = 7844214;
const CHUNK_SIZE = 10000;

const provider = new ethers.JsonRpcProvider(RPC_URL);

// CSV Writer
const csvWriter = createCsvWriter({
  path: "data/eth_logs.csv",
  header: [
    { id: "txHash", title: "tx_hash" },
    { id: "blockNumber", title: "block" },
    { id: "from", title: "from" },
    { id: "to", title: "to" },
    { id: "tokenId", title: "tokenId" },
    { id: "type", title: "type" },
  ],
});

// === MAIN ===
(async () => {
  const latest = await provider.getBlockNumber();
  const allRecords = [];

  console.log(`📦 Fetching logs from block ${START_BLOCK} to ${latest}...`);

  for (let fromBlock = START_BLOCK; fromBlock <= latest; fromBlock += CHUNK_SIZE) {
    const toBlock = Math.min(fromBlock + CHUNK_SIZE - 1, latest);
    console.log(`🔎 Blocks ${fromBlock}–${toBlock}...`);

    const filter = {
      address: CONTRACT_ADDRESS,
      fromBlock,
      toBlock,
      topics: [ethers.id("Transfer(address,address,uint256)")],
    };

    try {
      const logs = await provider.getLogs(filter);
      const records = logs.map((log) => {
        const from = "0x" + log.topics[1].slice(26);
        const to = "0x" + log.topics[2].slice(26);
        const tokenId = BigInt(log.topics[3]).toString();

        return {
          txHash: log.transactionHash,
          blockNumber: log.blockNumber,
          from,
          to,
          tokenId,
          type: from.toLowerCase() === ZERO_ADDRESS ? "MINT" : "TRANSFER",
        };
      });

      allRecords.push(...records);
      console.log(`✅ ${records.length} records`);
    } catch (err) {
      console.error(`❌ Error in blocks ${fromBlock}–${toBlock}:`, err.message);
    }
  }

  // Save to CSV
  console.log("💾 Saving to data/eth_logs.csv...");
  await csvWriter.writeRecords(allRecords);
  console.log("✅ Done.");
})();
