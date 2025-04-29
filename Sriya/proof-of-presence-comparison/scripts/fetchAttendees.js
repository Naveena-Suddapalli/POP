require("dotenv").config();
const axios = require("axios");

const POAP_API_KEY = process.env.POAP_API_KEY;
const eventId = 185234; // Replace with another if needed

async function fetchAttendees() {
  try {
    const response = await axios.get(`https://api.poap.tech/event/${eventId}/poaps`, {
      headers: {
        "X-API-Key": POAP_API_KEY
      }
    });

    const attendees = response.data;

    if (Array.isArray(attendees) && attendees.length > 0) {
      console.log(`✅ ${attendees.length} wallets have claimed this POAP:\n`);
      attendees.forEach((entry, i) => {
        console.log(`${i + 1}. ${entry.owner} (Token ID: ${entry.tokenId})`);
      });
    } else {
      console.log("⚠️ No attendees found or event claims are private.");
    }

  } catch (error) {
    console.error("❌ Failed to fetch attendees:", error.response?.data || error.message);
  }
}

fetchAttendees();
