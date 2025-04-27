import React, { useState } from 'react';

const AttendanceNFTs = ({ contract, account }) => {
  const [events, setEvents] = useState([]);
  const [eventIdInput, setEventIdInput] = useState('');

  const fetchNFTs = async () => {
    if (contract && account && eventIdInput) {
      const userEvents = [];
      try {
        const hasCheckedIn = await contract.verifyAttendance(account, eventIdInput);
        if (hasCheckedIn) {
          const tokenId = await contract.getTokenId(account, eventIdInput);
          const tokenURI = await contract.tokenURI(tokenId);
          userEvents.push({ eventId: eventIdInput, tokenId, tokenURI });
        }
      } catch (error) {
        console.error(`Error fetching NFT for event ${eventIdInput}:`, error);
      }
      setEvents(userEvents);
    }
  };

  const handleFetchNFTs = () => {
    fetchNFTs();
  };

  return (
    <div className="card">
      <h2>Your Attendance NFTs</h2>
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
      {events.length === 0 ? (
        <p style={{ color: '#4b5563' }}>No attendance NFTs found.</p>
      ) : (
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