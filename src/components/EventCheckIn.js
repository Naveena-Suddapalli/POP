import React, { useState } from 'react';
import axios from 'axios';

const EventCheckIn = ({ contract, account }) => {
  const [eventId, setEventId] = useState('');
  const [checkInStatus, setCheckInStatus] = useState(null);

  const pinataApiKey = "7c6b2d38455b610f76ed"; // ⚠️ In production, don't expose API keys like this!
  const pinataSecretApiKey = "4148832e09f079b45ce7e6fd7904a7b5853b5b0bfd33ebb9849815e9520e8967";

  const handleCheckIn = async () => {
    if (!contract || !account) {
      alert('Please connect your wallet first!');
      return;
    }

    try {
      const metadata = {
        name: `Proof of Presence: ${eventId}`,
        description: `Attendance NFT for event ${eventId}`,
        eventId: eventId,
        attendee: account,
        timestamp: Math.floor(Date.now() / 1000),
      };

      const response = await axios.post(
        'https://api.pinata.cloud/pinning/pinJSONToIPFS',
        metadata,
        {
          headers: {
            pinata_api_key: pinataApiKey,
            pinata_secret_api_key: pinataSecretApiKey,
          },
        }
      );

      const tokenURI = `https://orange-acute-quelea-468.mypinata.cloud/ipfs/${response.data.IpfsHash}`;

      const tx = await contract.checkIn(eventId, tokenURI);
      await tx.wait();
      setCheckInStatus('✅ Successfully checked in!');
      setEventId('');
    } catch (error) {
      console.error('Check-in error:', error);

      let message = "Unknown error";

      // Extract clean error reason
      if (error.error && error.error.data && error.error.data.message) {
        message = error.error.data.message;
      } else if (error.reason) {
        message = error.reason;
      } else if (error.data && error.data.message) {
        message = error.data.message;
      } else if (error.message) {
        message = error.message;
      }

      // Clean "execution reverted:" prefix
      message = message.replace("execution reverted: ", "");

      setCheckInStatus('❌ Failed to check in: ' + message);
    }
  };

  return (
    <div className="card">
      <h2>Check In to Event</h2>
      <div className="checkin-form">
        <input
          type="text"
          placeholder="Enter Event ID"
          value={eventId}
          onChange={(e) => setEventId(e.target.value)}
          style={{
            width: '100%',
            padding: '0.5rem',
            marginBottom: '1rem',
            borderRadius: '0.5rem',
            border: '1px solid #ccc',
          }}
        />
        <button
          onClick={handleCheckIn}
          style={{
            backgroundColor: '#16a34a',
            color: 'white',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '0.5rem',
            cursor: 'pointer',
          }}
        >
          Check In
        </button>
      </div>

      {checkInStatus && (
        <p
          style={{
            marginTop: '1rem',
            textAlign: 'center',
            color: checkInStatus.includes('Failed') ? '#dc2626' : '#16a34a',
            fontWeight: '500',
          }}
        >
          {checkInStatus}
        </p>
      )}
    </div>
  );
};

export default EventCheckIn;
