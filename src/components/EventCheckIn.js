import React, { useState } from 'react';

const EventCheckIn = ({ contract, account }) => {
  const [eventId, setEventId] = useState('');
  const [checkInStatus, setCheckInStatus] = useState(null);

  const handleCheckIn = async () => {
    if (!contract || !account) {
      alert('Please connect your wallet first!');
      return;
    }

    try {
      await contract.checkIn(eventId);
      setCheckInStatus('Successfully checked in! (Mock)');
      setEventId('');
    } catch (error) {
      console.error('Check-in error:', error);
      setCheckInStatus('Failed to check in. (Mock)');
    }
  };

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
        Check In to Event
      </h2>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Enter Event ID"
          value={eventId}
          onChange={(e) => setEventId(e.target.value)}
          style={{
            flex: 1,
            padding: '0.5rem',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            fontSize: '1rem',
            outline: 'none',
            transition: 'border-color 0.3s',
          }}
          onFocus={(e) => (e.target.style.borderColor = '#3b82f6')}
          onBlur={(e) => (e.target.style.borderColor = '#d1d5db')}
        />
        <button
          onClick={handleCheckIn}
          style={{
            backgroundColor: '#16a34a',
            color: 'white',
            padding: '0.5rem 1rem',
            border: 'none',
            borderRadius: '8px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'background-color 0.3s',
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = '#15803d')}
          onMouseOut={(e) => (e.target.style.backgroundColor = '#16a34a')}
        >
          Check In
        </button>
      </div>
      {checkInStatus && (
        <p style={{ marginTop: '1rem', color: '#4b5563', fontSize: '0.9rem' }}>
          {checkInStatus}
        </p>
      )}
    </div>
  );
};

export default EventCheckIn;