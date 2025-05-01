// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.9.3/contracts/token/ERC721/ERC721.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.9.3/contracts/utils/Strings.sol";

/**
 * @title AttendanceVerification
 * @dev A decentralized system for event attendance verification using non-transferable NFTs (Soulbound Tokens).
 * Events are stored with IPFS metadata, and check-ins are validated within a time window.
 */
contract AttendanceVerification is ERC721 {
    struct Event {
        uint256 startTime;
        uint256 endTime;
        string ipfsHash;
        bool active;
    }

    mapping(uint256 => Event) public events;
    mapping(uint256 => mapping(address => bool)) public hasCheckedIn;
    uint256 public eventCount;

    event EventCreated(uint256 indexed eventId, uint256 startTime, uint256 endTime, string ipfsHash);
    event CheckedIn(uint256 indexed eventId, address indexed attendee);
    event NFTMinted(uint256 indexed eventId, address indexed attendee, uint256 tokenId);

    constructor() ERC721("ProofOfPresence", "POP") {}

    function createEvent(
        uint256 startTime,
        uint256 endTime,
        string memory ipfsHash
    ) external {
        require(startTime < endTime, "Invalid time window");
        require(endTime > block.timestamp, "Event in the past");
        require(bytes(ipfsHash).length > 0, "Empty IPFS hash");

        events[eventCount] = Event(startTime, endTime, ipfsHash, true);
        emit EventCreated(eventCount, startTime, endTime, ipfsHash);
        eventCount++;
    }

    function checkIn(uint256 eventId) external {
        Event memory evt = events[eventId];
        require(evt.active, "Event not active");
        require(block.timestamp >= evt.startTime, "Event not started");
        require(block.timestamp <= evt.endTime, "Event ended");
        require(!hasCheckedIn[eventId][msg.sender], "Already checked in");

        hasCheckedIn[eventId][msg.sender] = true;
        uint256 tokenId = uint256(keccak256(abi.encodePacked(eventId, msg.sender)));
        _safeMint(msg.sender, tokenId);
        emit CheckedIn(eventId, msg.sender);
        emit NFTMinted(eventId, msg.sender, tokenId);
    }

    function _transfer(address, address, uint256) internal override {
        revert("Soulbound: Transfers not allowed");
    }

    function verifyAttendance(uint256 eventId, address attendee) external view returns (bool) {
        return hasCheckedIn[eventId][attendee];
    }

    function getEvent(uint256 eventId) external view returns (uint256, uint256, string memory, bool) {
        Event memory evt = events[eventId];
        return (evt.startTime, evt.endTime, evt.ipfsHash, evt.active);
    }
}