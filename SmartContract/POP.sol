// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title ProofOfPresence (POP)
 * @dev A soulbound NFT contract for verifying event attendance
 * This contract implements:
 * - Event creation with time windows
 * - Attendance check-ins with NFT minting
 * - Non-transferable (soulbound) tokens
 * - Testing mode for development environments
 */
contract ProofOfPresence {
    string public name = "ProofOfPresenceNFT";
    string public symbol = "POPNFT";
    uint256 private _tokenIds;
    address public owner;
    bool public isTestingMode;

    /**
     * @dev Represents an NFT token with ownership and metadata
     * @param owner Address that owns this token
     * @param tokenURI IPFS URI containing token metadata
     * @param eventId Associated event identifier
     * @param exists Flag indicating if token exists
     */
    struct Token {
        address owner;
        string tokenURI;
        string eventId;
        bool exists;
    }

    /**
     * @dev Represents a time-bound event
     * @param startTime Unix timestamp when check-ins can begin
     * @param endTime Unix timestamp when check-ins end
     * @param exists Flag indicating if event exists
     */
    struct Event {
        uint256 startTime;
        uint256 endTime;
        bool exists;
    }

    /** @dev Maps token IDs to their data */
    mapping(uint256 => Token) public tokens;
    
    /** @dev Maps event IDs to their data */
    mapping(string => Event) public events;
    
    /** @dev Maps user addresses and event IDs to check-in status */
    mapping(address => mapping(string => bool)) public hasCheckedIn;
    
    /** @dev Maps user addresses and event IDs to their token IDs */
    mapping(address => mapping(string => uint256)) public userEventToken;

    /** 
     * @dev Emitted when a user checks into an event
     * @param user Address of the attendee
     * @param eventId Unique identifier of the event
     * @param tokenId ID of the minted NFT
     */
    event CheckIn(address indexed user, string eventId, uint256 tokenId);
    
    /** 
     * @dev Emitted when a new NFT is minted
     * @param to Address of the recipient
     * @param tokenId ID of the minted NFT
     * @param uri IPFS URI containing metadata
     */
    event Mint(address indexed to, uint256 tokenId, string uri);
    
    /** 
     * @dev Emitted when a new event is created
     * @param eventId Unique identifier of the event
     * @param startTime Unix timestamp when event check-ins begin
     * @param endTime Unix timestamp when event check-ins end
     */
    event EventCreated(string eventId, uint256 startTime, uint256 endTime);
    
    /** 
     * @dev Emitted when an attempt is made to create an event
     * @param eventId Unique identifier of the event
     * @param startTime Unix timestamp when event check-ins begin
     * @param currentTimestamp Current block timestamp
     */
    event EventCreationAttempt(string eventId, uint256 startTime, uint256 currentTimestamp);
    
    /** 
     * @dev Emitted when testing mode is toggled
     * @param isEnabled Boolean indicating if testing mode is enabled
     */
    event TestingModeToggled(bool isEnabled);
    
    /** 
     * @dev Emitted when the contract is deployed
     * @param owner Address of the contract owner
     * @param isTestingMode Boolean indicating if testing mode is enabled
     */
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

    /**
     * @dev Helper function to get the current block timestamp
     * @return uint256 Current block timestamp
     */
    function getCurrentTimestamp() public view returns (uint256) {
        return block.timestamp;
    }

    /**
     * @dev Function to toggle testing mode (only owner)
     * @param enable Boolean indicating whether to enable or disable testing mode
     */
    function toggleTestingMode(bool enable) public onlyOwner {
        isTestingMode = enable;
        emit TestingModeToggled(enable);
    }

    /**
     * @dev Creates a new time-bound event
     * @param eventId Unique identifier for the event
     * @param startTime Unix timestamp when event check-ins begin
     * @param endTime Unix timestamp when event check-ins end
     * Requirements:
     * - Caller must be contract owner
     * - Event ID must not exist
     * - Start time must be before end time
     * - Start time must be in future (unless testing mode)
     */
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

    /**
     * @dev Allows attendee to check in to an event and mint attendance NFT
     * @param eventId Identifier of event to check into
     * @param uri IPFS URI containing attendance metadata
     * Requirements:
     * - Event must exist
     * - Current time must be within event window
     * - Attendee must not have already checked in
     */
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

    /**
     * @dev Verifies if a user has checked into an event
     * @param user Address of the user to check
     * @param eventId Identifier of the event
     * @return bool True if user has checked in, false otherwise
     */
    function verifyAttendance(address user, string memory eventId) public view returns (bool) {
        return hasCheckedIn[user][eventId];
    }

    /**
     * @dev Retrieves the token ID associated with a user's attendance at an event
     * @param user Address of the user
     * @param eventId Identifier of the event
     * @return uint256 Token ID associated with the user's attendance
     */
    function getTokenId(address user, string memory eventId) public view returns (uint256) {
        require(hasCheckedIn[user][eventId], "User has not checked in");
        return userEventToken[user][eventId];
    }

    /**
     * @dev Retrieves the metadata URI of a token
     * @param tokenId ID of the token
     * @return string IPFS URI containing token metadata
     */
    function tokenURI(uint256 tokenId) public view returns (string memory) {
        require(tokens[tokenId].exists, "Token does not exist");
        return tokens[tokenId].tokenURI;
    }

    /**
     * @dev Retrieves the owner of a token
     * @param tokenId ID of the token
     * @return address Address of the token owner
     */
    function ownerOf(uint256 tokenId) public view returns (address) {
        require(tokens[tokenId].exists, "Token does not exist");
        return tokens[tokenId].owner;
    }

    /**
     * @dev Prevents token transfer (soulbound)
     */
    function transferFrom(address, address, uint256) public pure {
        revert("Soulbound: transfer not allowed");
    }

    /**
     * @dev Prevents token approval (soulbound)
     */
    function approve(address, uint256) public pure {
        revert("Soulbound: approval not allowed");
    }

    /**
     * @dev Prevents approval for all tokens (soulbound)
     */
    function setApprovalForAll(address, bool) public pure {
        revert("Soulbound: approval for all not allowed");
    }

    /**
     * @dev Prevents safe token transfer (soulbound)
     */
    function safeTransferFrom(address, address, uint256) public pure {
        revert("Soulbound: transfer not allowed");
    }

    /**
     * @dev Prevents safe token transfer with data (soulbound)
     */
    function safeTransferFrom(address, address, uint256, bytes memory) public pure {
        revert("Soulbound: transfer not allowed");
    }
}