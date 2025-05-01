const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const { ethers } = require("ethers");
const Chart = require("cli-chart");

// === CONFIG ===
const provider = new ethers.JsonRpcProvider(
  "https://eth-mainnet.g.alchemy.com/v2/p2PdEXnut98vKwj16Qfuv3IUG7hClh1d"
);
const INPUT_CSV = path.join(__dirname, "../data/eth_logs.csv");
const OUTPUT_JSON = path.join(__dirname, "../data/eth_summary.json");

const logs = [];

fs.createReadStream(INPUT_CSV)
  .pipe(csv())
  .on("data", (row) => logs.push(row))
  .on("end", async () => {
    console.log("✅ Read logs. Analyzing...");

    const mintLogs = logs.filter((log) => log.type === "MINT").slice(0, 48231);
    const wallets = new Set();
    const receiverCounts = {};
    const blockTimestamps = {};
    const gasUsedPerTx = {};
    const gasFeesInETH = {};
    const dateCounts = {};

    for (const log of mintLogs) {
      wallets.add(log.to.toLowerCase());
      receiverCounts[log.to] = (receiverCounts[log.to] || 0) + 1;
    }

    const firstTimestamps = [];
    const lastTimestamps = [];

    for (let i = 0; i < mintLogs.length; i++) {
      const log = mintLogs[i];
      console.log(`🔄 Processing mint ${i + 1} of ${mintLogs.length}`);
      const blockNum = parseInt(log.block);
      const txHash = log.tx_hash;

      try {
        if (!blockTimestamps[blockNum]) {
          const block = await provider.getBlock(blockNum);
          blockTimestamps[blockNum] = block.timestamp;
          const date = new Date(block.timestamp * 1000).toISOString().slice(0, 10);
          dateCounts[date] = (dateCounts[date] || 0) + 1;
        }

        const blockTimestamp = blockTimestamps[blockNum];
        firstTimestamps.push(blockTimestamp);
        lastTimestamps.push(blockTimestamp);

        const receipt = await provider.getTransactionReceipt(txHash);
        const gasUsed = Number(receipt.gasUsed);
        gasUsedPerTx[txHash] = gasUsed;

        const tx = await provider.getTransaction(txHash);
        const gasPrice = Number(tx.gasPrice);
        const feeInETH = (gasUsed * gasPrice) / 1e18;
        gasFeesInETH[txHash] = feeInETH;
      } catch (err) {
        console.error(`❌ Error at tx ${txHash}: ${err.message}`);
      }
    }

    // === Calculations ===
    const allGasUsed = Object.values(gasUsedPerTx);
    const allFees = Object.values(gasFeesInETH);
    const totalGas = allGasUsed.reduce((a, b) => a + b, 0);
    const avgGas = allGasUsed.length > 0 ? totalGas / allGasUsed.length : 0;
    const maxGas = Math.max(...allGasUsed);
    const minGas = Math.min(...allGasUsed);

    const totalFeesInETH = allFees.reduce((a, b) => a + b, 0);
    const avgFeePerMint = mintLogs.length > 0 ? totalFeesInETH / mintLogs.length : 0;

    const mintStart = Math.min(...firstTimestamps);
    const mintEnd = Math.max(...lastTimestamps);
    const durationSeconds = mintEnd - mintStart;
    const latencyPerMint = mintLogs.length > 1 ? durationSeconds / (mintLogs.length - 1) : 0;

    const busiestDay = Object.keys(dateCounts).reduce((a, b) =>
      dateCounts[a] > dateCounts[b] ? a : b
    );

    // === Chart (Mints only) ===
    const chart = new Chart({
      xlabel: "Mint Count",
      ylabel: "Volume",
      width: 40,
      height: 20,
      direction: "y",
    });
    chart.addBar(mintLogs.length, "green");
    console.log("\n📊 Mint Chart (500 entries):");
    chart.draw();

    // === Save JSON Summary ===
    const summary = {
      totalMints: mintLogs.length,
      uniqueWallets: wallets.size,
      topReceiver: Object.keys(receiverCounts).reduce((a, b) =>
        receiverCounts[a] > receiverCounts[b] ? a : b
      ),
      busiestDay,
      gas: {
        totalGas,
        avgGas: Math.round(avgGas),
        minGas,
        maxGas,
      },
      fees: {
        totalFeesInETH: totalFeesInETH.toFixed(6),
        averageFeePerMintInETH: avgFeePerMint.toFixed(6),
      },
      timing: {
        firstMint: new Date(mintStart * 1000).toISOString(),
        lastMint: new Date(mintEnd * 1000).toISOString(),
        totalDurationSeconds: durationSeconds,
        totalDurationMinutes: Math.round(durationSeconds / 60),
        totalDurationHours: (durationSeconds / 3600).toFixed(2),
        latencyPerMintSeconds: latencyPerMint.toFixed(2),
      },
      dateCounts,
    };

    fs.writeFileSync(OUTPUT_JSON, JSON.stringify(summary, null, 2));
    console.log(`\n✅ Summary saved to ${OUTPUT_JSON}`);
  });
