// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract ProofOfPresence {
    string public name = "ProofOfPresenceNFT";
    string public symbol = "POPNFT";
    uint256 private _tokenIds;
    address public owner;
    bool public isTestingMode;

    struct Token {
        address owner;
        string tokenURI;
        string eventId;
        bool exists;
    }

    struct Event {
        uint256 startTime;
        uint256 endTime;
        bool exists;
    }

    mapping(uint256 => Token) public tokens;
    mapping(string => Event) public events;
    mapping(address => mapping(string => bool)) public hasCheckedIn;
    mapping(address => mapping(string => uint256)) public userEventToken;

    event CheckIn(address indexed user, string eventId, uint256 tokenId);
    event Mint(address indexed to, uint256 tokenId, string uri);
    event EventCreated(string eventId, uint256 startTime, uint256 endTime);
    event EventCreationAttempt(string eventId, uint256 startTime, uint256 currentTimestamp);
    event TestingModeToggled(bool isEnabled);
    event ContractDeployed(address owner, bool isTestingMode);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    constructor() {
        owner = msg.sender;
        isTestingMode = false; // Disable testing mode by default for production
        emit ContractDeployed(owner, isTestingMode);
    }

    // Helper function to get the current block timestamp
    function getCurrentTimestamp() public view returns (uint256) {
        return block.timestamp;
    }

    // Function to toggle testing mode (only owner)
    function toggleTestingMode(bool enable) public onlyOwner {
        isTestingMode = enable;
        emit TestingModeToggled(enable);
    }

    function createEvent(string memory eventId, uint256 startTime, uint256 endTime) public onlyOwner {
        require(!events[eventId].exists, "Event already exists");
        require(startTime < endTime, "Invalid time window");

        uint256 currentTime = getCurrentTimestamp();
        emit EventCreationAttempt(eventId, startTime, currentTime);

        // Only enforce start time constraint if not in testing mode
        if (!isTestingMode) {
            require(startTime >= currentTime, "Start time must be in the future");
        }

        events[eventId] = Event({
            startTime: startTime,
            endTime: endTime,
            exists: true
        });

        emit EventCreated(eventId, startTime, endTime);
    }

    function checkIn(string memory eventId, string memory uri) public {
        require(events[eventId].exists, "Event does not exist");
        uint256 currentTime = getCurrentTimestamp();
        require(currentTime >= events[eventId].startTime, "Event has not started");
        require(currentTime <= events[eventId].endTime, "Event has ended");
        require(!hasCheckedIn[msg.sender][eventId], "Already checked in");

        _tokenIds += 1;
        uint256 tokenId = _tokenIds;

        tokens[tokenId] = Token({
            owner: msg.sender,
            tokenURI: uri,
            eventId: eventId,
            exists: true
        });

        hasCheckedIn[msg.sender][eventId] = true;
        userEventToken[msg.sender][eventId] = tokenId;

        emit Mint(msg.sender, tokenId, uri);
        emit CheckIn(msg.sender, eventId, tokenId);
    }

    function verifyAttendance(address user, string memory eventId) public view returns (bool) {
        return hasCheckedIn[user][eventId];
    }

    function getTokenId(address user, string memory eventId) public view returns (uint256) {
        require(hasCheckedIn[user][eventId], "User has not checked in");
        return userEventToken[user][eventId];
    }

    function tokenURI(uint256 tokenId) public view returns (string memory) {
        require(tokens[tokenId].exists, "Token does not exist");
        return tokens[tokenId].tokenURI;
    }

    function ownerOf(uint256 tokenId) public view returns (address) {
        require(tokens[tokenId].exists, "Token does not exist");
        return tokens[tokenId].owner;
    }

    function transferFrom(address, address, uint256) public pure {
        revert("Soulbound: transfer not allowed");
    }

    function approve(address, uint256) public pure {
        revert("Soulbound: approval not allowed");
    }

    function setApprovalForAll(address, bool) public pure {
        revert("Soulbound: approval for all not allowed");
    }

    function safeTransferFrom(address, address, uint256) public pure {
        revert("Soulbound: transfer not allowed");
    }

    function safeTransferFrom(address, address, uint256, bytes memory) public pure {
        revert("Soulbound: transfer not allowed");
    }
}