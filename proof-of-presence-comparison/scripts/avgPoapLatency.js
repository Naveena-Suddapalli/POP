require("dotenv").config();
const axios = require("axios");

const eventId = 185234;
const POAP_API_KEY = process.env.POAP_API_KEY;

async function testLatency(repeats = 5) {
  let totalTime = 0;

  for (let i = 0; i < repeats; i++) {
    const start = Date.now();

    try {
      await axios.get(`https://api.poap.tech/event/${eventId}/poaps`, {
        headers: {
          "X-API-Key": POAP_API_KEY,
        }
      });
    } catch (e) {
      console.warn(`⚠️ Request ${i + 1} failed`);
    }

    const duration = Date.now() - start;
    console.log(`Call ${i + 1}: ${duration} ms`);
    totalTime += duration;
  }

  const avg = totalTime / repeats;
  console.log(`\n📊 Average POAP API latency over ${repeats} calls: ${avg.toFixed(2)} ms`);
}

testLatency();
