// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

import "./Discussion.sol";

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/metatx/ERC2771Context.sol";


contract DiscussionBoard is ERC2771Context {

    IERC20 private token;
    Discussion[] private discussions;
    address private trustedForwarder;
    
    /// @dev Pass a trusted forwarder to ERC2771Context
    constructor(address _token, address _trustedForwarder) 
    ERC2771Context(_trustedForwarder)
    {
        token = IERC20(_token);
        trustedForwarder = _trustedForwarder;
    }

    /// @notice Initiate a new discussion with the given arguments
    /// @dev Deploy a new Discussion contract instance
    function createDiscussion(string memory title, string memory description, uint256 rewardAmount) public {
    
        Discussion newDiscussion = new Discussion(title, description, address(token), trustedForwarder);
        newDiscussion.transferOwnership(_msgSender());

        token.transferFrom(_msgSender(), address(newDiscussion), rewardAmount);
        
        discussions.push(newDiscussion);
    }

    /// @notice Returns all discussions
    function getAllDiscussions() public view returns (Discussion[] memory) {
        return discussions;
    }
}