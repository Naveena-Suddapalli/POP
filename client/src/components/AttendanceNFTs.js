import React, { useState } from 'react';

/**
 * AttendanceNFTs Component
 * Displays user's attendance NFTs for specific events.
 * Features:
 * - NFT ownership verification
 * - IPFS metadata display
 * - Token ID tracking
 * 
 * @param {Object} contract - The smart contract instance
 * @param {String} account - User's Ethereum address
 */
const AttendanceNFTs = ({ contract, account }) => {
  // State management for events and user input
  const [events, setEvents] = useState([]); // Stores fetched NFT data
  const [eventIdInput, setEventIdInput] = useState(''); // Tracks user input for event ID

  /**
   * Fetches NFT data for a specific event ID
   * Checks attendance and retrieves token details if verified
   */
  const fetchNFTs = async () => {
    if (contract && account && eventIdInput) {
      const userEvents = [];
      try {
        // Verify user's attendance for the event
        const hasCheckedIn = await contract.verifyAttendance(account, eventIdInput);
        
        if (hasCheckedIn) {
          // Retrieve token details if attendance is verified
          const tokenId = await contract.getTokenId(account, eventIdInput);
          const tokenURI = await contract.tokenURI(tokenId);
          userEvents.push({ eventId: eventIdInput, tokenId, tokenURI });
        }
      } catch (error) {
        console.error(`Error fetching NFT for event ${eventIdInput}:`, error);
      }
      setEvents(userEvents); // Update state with fetched NFTs
    }
  };

  // Handler for the fetch button click
  const handleFetchNFTs = () => {
    fetchNFTs();
  };

  // Render component UI
  return (
    <div className="card">
      <h2>Your Attendance NFTs</h2>
      {/* NFT lookup form */}
      <div className="checkin-form">
        <input
          type="text"
          placeholder="Enter Event ID to Check"
          value={eventIdInput}
          onChange={(e) => setEventIdInput(e.target.value)}
        />
        <button
          onClick={handleFetchNFTs}
          style={{
            backgroundColor: '#6d28d9',
            color: 'white',
          }}
        >
          Fetch NFTs
        </button>
      </div>

      {/* Conditional rendering based on NFT results */}
      {events.length === 0 ? (
        // Display when no NFTs are found
        <p style={{ color: '#4b5563' }}>No attendance NFTs found.</p>
      ) : (
        // Grid display of found NFTs
        <div className="nft-grid">
          {events.map((event) => (
            <div
              key={`${event.eventId}-${event.tokenId}`}
              className="nft-card"
            >
              <div style={{ padding: '0.5rem' }}>
                <h3>Event ID: {event.eventId}</h3>
                <p>Token ID: {event.tokenId.toString()}</p>
                <p>
                  {/* External link to IPFS metadata */}
                  <a
                    href={event.tokenURI}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    IPFS Metadata: View
                  </a>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AttendanceNFTs;