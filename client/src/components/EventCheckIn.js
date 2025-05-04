import React, { useState } from 'react';
import axios from 'axios';

/**
 * EventCheckIn Component
 * Handles event attendance check-ins and NFT minting.
 * Features:
 * - IPFS metadata creation and pinning
 * - Smart contract interaction for check-ins
 * - Error handling with user feedback
 * 
 * @param {Object} contract - The smart contract instance
 * @param {String} account - User's Ethereum address
 */
const EventCheckIn = ({ contract, account }) => {
  // State for form management and status updates
  const [eventId, setEventId] = useState('');
  const [checkInStatus, setCheckInStatus] = useState(null);

  // Pinata API keys for IPFS integration
  const pinataApiKey = process.env.REACT_APP_PINATA_API_KEY;
  const pinataSecretApiKey = process.env.REACT_APP_PINATA_SECRET_API_KEY;

  /**
   * Handles the check-in process
   * 1. Creates metadata for NFT
   * 2. Pins data to IPFS via Pinata
   * 3. Calls smart contract to mint NFT
   */
  const handleCheckIn = async () => {
    if (!contract || !account) {
      alert('Please connect your wallet first!'); // Ensure wallet is connected
      return;
    }

    try {
      // Metadata for the attendance NFT
      const metadata = {
        name: `Proof of Presence: ${eventId}`,
        description: `Attendance NFT for event ${eventId}`,
        eventId: eventId,
        attendee: account,
        timestamp: Math.floor(Date.now() / 1000),
      };

      // Pin metadata to IPFS using Pinata
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

      // Construct token URI from IPFS hash
      const tokenURI = `https://orange-acute-quelea-468.mypinata.cloud/ipfs/${response.data.IpfsHash}`;

      // Call the smart contract's check-in function
      const tx = await contract.checkIn(eventId, tokenURI);
      await tx.wait(); // Wait for transaction confirmation
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

  // Render component UI with form and status message
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
