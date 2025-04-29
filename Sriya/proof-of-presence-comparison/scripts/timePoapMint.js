require("dotenv").config();
const axios = require("axios");

async function timePoapMint(eventId) {
  console.time("⏱️ API Mint Timing");

  try {
    const response = await axios.get(`https://api.poap.tech/event/${eventId}/poaps`, {
      headers: {
        "X-API-Key": process.env.POAP_API_KEY,
      }
    });

    console.timeEnd("⏱️ API Mint Timing");
    console.log(`✅ Total POAPs claimed: ${response.data?.length || "No data found"}`);
  } catch (error) {
    console.timeEnd("⏱️ API Mint Timing");
    console.error("❌ Error during POAP API call:", error.response?.data || error.message);
  }
}

timePoapMint(185234); // Replace with your POAP event ID
