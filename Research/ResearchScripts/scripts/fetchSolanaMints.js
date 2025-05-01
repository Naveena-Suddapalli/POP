const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

// === CONFIG ===
const METAPLEX_READ_API = "const METAPLEX_READ_API = "https://read-api.metaplex.com/graphql"; // You need access approved
const CREATOR = "FFic3UEWZaKuSN45YxAyQGCWoh22M2B1c5rfxpoypHcV";
const OUTPUT_CSV = path.join(__dirname, "../data/solana_readapi_nfts.csv");
const BATCH_SIZE = 50;
const MAX_BATCHES = 20; // Adjust as needed

// === CSV Writer Setup
const csvWriter = createCsvWriter({
  path: OUTPUT_CSV,
  header: [
    { id: "mintAddress", title: "mint_address" },
    { id: "name", title: "name" },
    { id: "updateAuthority", title: "update_authority" },
    { id: "eventDate", title: "event_date" },
  ],
});

async function fetchNFTsByCreator(offset = 0) {
  const query = `
    query {
      nfts(
        where: {
          creator: { _eq: "${CREATOR}" }
        },
        limit: ${BATCH_SIZE},
        offset: ${offset}
      ) {
        mintAddress
        name
        updateAuthority
        jsonMetadata {
          attributes {
            trait_type
            value
          }
        }
      }
    }
  `;

  const response = await fetch(METAPLEX_READ_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    throw new Error(`GraphQL request failed: ${response.statusText}`);
  }

  const data = await response.json();
  return data.data.nfts;
}

(async () => {
  console.log(`🔍 Fetching NFTs from Metaplex Read API by creator: ${CREATOR}`);

  const allRecords = [];

  for (let batch = 0; batch < MAX_BATCHES; batch++) {
    const offset = batch * BATCH_SIZE;
    console.log(`📦 Fetching batch ${batch + 1} (offset ${offset})...`);

    try {
      const nfts = await fetchNFTsByCreator(offset);

      if (!nfts.length) {
        console.log("✅ No more NFTs to fetch.");
        break;
      }

      for (const nft of nfts) {
        const eventDate = nft.jsonMetadata?.attributes?.find(
          (attr) => attr.trait_type?.toLowerCase() === "event_date"
        )?.value || "N/A";

        allRecords.push({
          mintAddress: nft.mintAddress,
          name: nft.name,
          updateAuthority: nft.updateAuthority,
          eventDate,
        });
      }
    } catch (err) {
      console.error(`❌ Error in batch ${batch + 1}: ${err.message}`);
      break;
    }

    await new Promise((res) => setTimeout(res, 1000)); // Rate limit protection
  }

  if (allRecords.length) {
    await csvWriter.writeRecords(allRecords);
    console.log(`✅ Saved ${allRecords.length} NFT records to ${OUTPUT_CSV}`);
  } else {
    console.log("⚠️ No NFTs were saved.");
  }
})();
