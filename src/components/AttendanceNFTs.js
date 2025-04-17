import React, { useState, useEffect } from 'react';

const AttendanceNFTs = ({ contract, account }) => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchNFTs = async () => {
      if (contract && account) {
        const eventIds = ['event1', 'event2'];
        const userEvents = [];

        for (const eventId of eventIds) {
          const hasCheckedIn = await contract.hasCheckedIn(account, eventId);
          if (hasCheckedIn) {
            userEvents.push({ eventId, ipfsHash: 'QmMockHash' });
          }
        }
        setEvents(userEvents);
      }
    };
    fetchNFTs();
  }, [contract, account]);

  return (
    <div
      style={{
        backgroundColor: 'white',
        padding: '1.5rem',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      }}
    >
      <h2
        style={{
          fontSize: '1.5rem',
          fontWeight: '600',
          marginBottom: '1rem',
          color: '#1f2937',
        }}
      >
        Your Attendance NFTs
      </h2>
      {events.length === 0 ? (
        <p style={{ color: '#4b5563' }}>No attendance NFTs found.</p>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1rem',
          }}
        >
          {events.map((event) => (
            <div
              key={event.eventId}
              style={{
                padding: '1rem',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                backgroundColor: '#f9fafb',
              }}
            >
              <h3 style={{ fontWeight: '600', color: '#1f2937' }}>
                Event ID: {event.eventId}
              </h3>
              <p>
                <a
                  href={`https://ipfs.io/ipfs/${event.ipfsHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#2563eb', textDecoration: 'underline' }}
                >
                  IPFS Metadata: View
                </a>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AttendanceNFTs;