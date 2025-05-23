import React, { useState } from 'react';

/**
 * CreateEvent Component
 * Allows organizers to create new time-bound events.
 * Features:
 * - DateTime validation
 * - Smart contract event creation
 * - Error handling with feedback
 * 
 * @param {Object} contract - The smart contract instance
 * @param {String} account - Organizer's Ethereum address
 */
const CreateEvent = ({ contract, account }) => {
  // State management for form inputs and status
  const [eventId, setEventId] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [status, setStatus] = useState(null);

  /**
   * Handles event creation process
   * 1. Validates input times
   * 2. Converts to UNIX timestamps
   * 3. Creates event on blockchain
   */
  const handleCreateEvent = async () => {
    if (!contract || !account) {
      alert('Please connect your wallet first!');
      return;
    }

    try {
      const startTimestamp = Math.floor(new Date(startTime).getTime() / 1000);
      const endTimestamp = Math.floor(new Date(endTime).getTime() / 1000);

      const tx = await contract.createEvent(eventId, startTimestamp, endTimestamp);
      await tx.wait();
      setStatus('✅ Event created successfully!');
      setEventId('');
      setStartTime('');
      setEndTime('');
    } catch (error) {
      console.error('Event creation error:', error);

      let message = "Unknown error";

      if (error.error && error.error.data && error.error.data.message) {
        message = error.error.data.message;
      } else if (error.reason) {
        message = error.reason;
      } else if (error.data && error.data.message) {
        message = error.data.message;
      } else if (error.message) {
        message = error.message;
      }

      message = message.replace("execution reverted: ", "");

      setStatus('❌ Failed to create event: ' + message);
    }
  };

  // Render form UI with validation feedback
  return (
    <div className="card">
      <h2>Create Event</h2>
      <div className="form-group">
        <input
          type="text"
          placeholder="Event ID (e.g., event123)"
          value={eventId}
          onChange={(e) => setEventId(e.target.value)}
        />
        <input
          type="datetime-local"
          placeholder="Start Time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />
        <input
          type="datetime-local"
          placeholder="End Time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
        />
        <button
          onClick={handleCreateEvent}
          style={{
            backgroundColor: '#6d28d9',
            color: 'white',
            width: '100%',
            marginTop: '1rem',
            padding: '0.5rem',
            borderRadius: '0.5rem',
          }}
        >
          Create Event
        </button>
      </div>
      {status && (
        <div
          className={`status-message ${status.includes('Failed') ? 'status-error' : 'status-success'}`}
          style={{
            marginTop: '1rem',
            color: status.includes('Failed') ? '#dc2626' : '#16a34a',
            fontWeight: '500',
            textAlign: 'center',
          }}
        >
          <p>{status}</p>
        </div>
      )}
    </div>
  );
};

export default CreateEvent;
