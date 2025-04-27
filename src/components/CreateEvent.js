import React, { useState } from 'react';

const CreateEvent = ({ contract, account }) => {
  const [eventId, setEventId] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [status, setStatus] = useState(null);

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
      setStatus('Event created successfully!');
      setEventId('');
      setStartTime('');
      setEndTime('');
    } catch (error) {
      console.error('Event creation error:', error);
      setStatus('Failed to create event: ' + error.message);
    }
  };

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
            backgroundColor: '#6d28d9', // Match other buttons
            color: 'white',
            width: '100%',
          }}
        >
          Create Event
        </button>
      </div>
      {status && (
        <div
          className={`status-message ${status.includes('Failed') ? 'status-error' : 'status-success'}`}
        >
          <p>{status}</p>
        </div>
      )}
    </div>
  );
};

export default CreateEvent;