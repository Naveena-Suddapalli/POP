export const contractAddress = '0xMockAddress';

export const contractABI = [
  {
    name: 'checkIn',
    type: 'function',
    inputs: [{ name: '_eventId', type: 'string' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    name: 'hasCheckedIn',
    type: 'function',
    inputs: [
      { name: '_user', type: 'address' },
      { name: '_eventId', type: 'string' },
    ],
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view',
  },
];

export const getMockContract = () => ({
  checkIn: async (eventId) => {
    console.log(`Mock check-in for event: ${eventId}`);
    return { wait: () => Promise.resolve() };
  },
  hasCheckedIn: async (user, eventId) => {
    console.log(`Mock hasCheckedIn for user ${user}, event ${eventId}`);
    return eventId === 'event1' || eventId === 'event2';
  },
});