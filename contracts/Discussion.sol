// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/metatx/ERC2771Context.sol";

contract Discussion is Ownable, ERC2771Context {
    
    struct Reply {
        string message;
        address replier;
    }
    
    IERC20 public token;
    
    string public title;
    string public description;
    bool public isClosed;
    uint256 public approvedReply;
    uint256 public replyCount;
    
    Reply[] public replies;
    
    constructor(string memory _title, string memory _description, address _token, address _trustedForwarder) 
    ERC2771Context(_trustedForwarder)
    {
        title = _title;
        description = _description;
        token = IERC20(_token);
        replyCount = 0;
    }
    
    function addReply(string memory _message) 
    public
    returns (bool) 
    {
        
        Reply storage newReply = replies.push();
        newReply.message = _message;
        newReply.replier = _msgSender();

        replyCount++;
        
        return true;
    }
    
    
    function approveReply(uint256 replyIndex) 
    public
    onlyOwner
    returns (bool) 
    {
        isClosed = true;
        approvedReply = replyIndex;
        
        uint256 amount = token.balanceOf(address(this));
        
        token.transfer(replies[replyIndex].replier, amount);
        
        return true;
    }
    
    function _msgSender() internal view virtual override(Context, ERC2771Context) returns (address sender) {
        if (isTrustedForwarder(msg.sender)) {
            // The assembly code is more direct than the Solidity version using `abi.decode`.
            assembly { sender := shr(96, calldataload(sub(calldatasize(), 20))) }
        } else {
            return super._msgSender();
        }
    }

    function _msgData() internal view virtual override(Context, ERC2771Context) returns (bytes calldata) {
        if (isTrustedForwarder(msg.sender)) {
            return msg.data[:msg.data.length-20];
        } else {
            return super._msgData();
        }
    }
    


}