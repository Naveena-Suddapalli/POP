export const contractAddress = "0x3f0f7682Ded761DaC1A0fa0bFe3f6EB5efFb1279";
export const contractABI = [
  {
    name: 'createEvent',
    type: 'function',
    inputs: [
      { name: 'eventId', type: 'string' },
      { name: 'startTime', type: 'uint256' },
      { name: 'endTime', type: 'uint256' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    name: 'checkIn',
    type: 'function',
    inputs: [
      { name: 'eventId', type: 'string' },
      { name: 'uri', type: 'string' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    name: 'verifyAttendance',
    type: 'function',
    inputs: [
      { name: 'user', type: 'address' },
      { name: 'eventId', type: 'string' },
    ],
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    name: 'getTokenId',
    type: 'function',
    inputs: [
      { name: 'user', type: 'address' },
      { name: 'eventId', type: 'string' },
    ],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    name: 'tokenURI',
    type: 'function',
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    outputs: [{ name: '', type: 'string' }],
    stateMutability: 'view',
  },
  {
    name: 'ownerOf',
    type: 'function',
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
  },
  {
    name: 'toggleTestingMode',
    type: 'function',
    inputs: [{ name: 'enable', type: 'bool' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    name: 'getCurrentTimestamp',
    type: 'function',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    name: 'transferFrom',
    type: 'function',
    inputs: [
      { name: '', type: 'address' },
      { name: '', type: 'address' },
      { name: '', type: 'uint256' },
    ],
    outputs: [],
    stateMutability: 'pure',
  },
  {
    name: 'approve',
    type: 'function',
    inputs: [
      { name: '', type: 'address' },
      { name: '', type: 'uint256' },
    ],
    outputs: [],
    stateMutability: 'pure',
  },
  {
    name: 'setApprovalForAll',
    type: 'function',
    inputs: [
      { name: '', type: 'address' },
      { name: '', type: 'bool' },
    ],
    outputs: [],
    stateMutability: 'pure',
  },
  {
    name: 'safeTransferFrom',
    type: 'function',
    inputs: [
      { name: '', type: 'address' },
      { name: '', type: 'address' },
      { name: '', type: 'uint256' },
    ],
    outputs: [],
    stateMutability: 'pure',
  },
  {
    name: 'safeTransferFrom',
    type: 'function',
    inputs: [
      { name: '', type: 'address' },
      { name: '', type: 'address' },
      { name: '', type: 'uint256' },
      { name: '', type: 'bytes' },
    ],
    outputs: [],
    stateMutability: 'pure',
  },
  {
    name: 'EventCreated',
    type: 'event',
    inputs: [
      { name: 'eventId', type: 'string', indexed: false },
      { name: 'startTime', type: 'uint256', indexed: false },
      { name: 'endTime', type: 'uint256', indexed: false },
    ],
  },
  {
    name: 'Mint',
    type: 'event',
    inputs: [
      { name: 'to', type: 'address', indexed: true },
      { name: 'tokenId', type: 'uint256', indexed: false },
      { name: 'uri', type: 'string', indexed: false },
    ],
  },
  {
    name: 'CheckIn',
    type: 'event',
    inputs: [
      { name: 'user', type: 'address', indexed: true },
      { name: 'eventId', type: 'string', indexed: false },
      { name: 'tokenId', type: 'uint256', indexed: false },
    ],
  },
  {
    name: 'EventCreationAttempt',
    type: 'event',
    inputs: [
      { name: 'eventId', type: 'string', indexed: false },
      { name: 'startTime', type: 'uint256', indexed: false },
      { name: 'currentTimestamp', type: 'uint256', indexed: false },
    ],
  },
  {
    name: 'TestingModeToggled',
    type: 'event',
    inputs: [{ name: 'isEnabled', type: 'bool', indexed: false }],
  },
  {
    name: 'ContractDeployed',
    type: 'event',
    inputs: [
      { name: 'owner', type: 'address', indexed: false },
      { name: 'isTestingMode', type: 'bool', indexed: false },
    ],
  },
];