// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Discussion.sol";

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/metatx/ERC2771Context.sol";


contract DiscussionBoard is ERC2771Context {

    IERC20 public token;
    Discussion[] public discussions;
    address private trustedForwarder;
    
    constructor(address _token, address _trustedForwarder) 
    ERC2771Context(_trustedForwarder)
    {
        token = IERC20(_token);
        trustedForwarder = _trustedForwarder;
    }

    function createDiscussion(string memory title, string memory description, uint256 rewardAmount) public {
    
        Discussion newDiscussion = new Discussion(title, description, address(token), trustedForwarder);
        newDiscussion.transferOwnership(_msgSender());

        token.transferFrom(_msgSender(), address(newDiscussion), rewardAmount);
        
        discussions.push(newDiscussion);
    }

    function getAllDiscussions() public view returns (Discussion[] memory) {
        return discussions;
    }
}