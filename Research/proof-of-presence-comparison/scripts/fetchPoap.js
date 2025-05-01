require("dotenv").config();
const axios = require("axios");

const POAP_API_KEY = process.env.POAP_API_KEY;

async function fetchPoapEvent(eventId) {
  try {
    const response = await axios.get(`https://api.poap.tech/events/id/${eventId}`, {
      headers: {
        "X-API-Key": POAP_API_KEY,
      },
    });

    console.log("🎉 POAP Event Data:\n", response.data);
  } catch (error) {
    console.error("❌ Error fetching POAP event:", error.response?.data || error.message);
  }
}

// Replace this ID with a real POAP event ID from your dashboard if you have one
fetchPoapEvent(185234);
