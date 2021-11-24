// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/metatx/ERC2771Context.sol";

/// @title Contract representing discussion thread
/// @author Samphan Pojanasophanakul
contract Discussion is Ownable, ERC2771Context {
    
    struct Reply {
        string message;
        address replier;
    }
    
    IERC20 private token;
    
    /// @notice Title of discusstion
    string public title;

    /// @notice Discussion detail
    string public description;

    /// @notice Indicate if this discussion is already closed
    bool public isClosed;

    /// @notice If the description is closed, which is the approved reply
    /// @dev Represented by the index of approved reply from the Reply array
    uint256 public approvedReply;

    /// @notice Number of all replies
    uint256 public replyCount;
    
    /// @dev Store the list or all replies
    Reply[] public replies;
    
    /// @dev Pass a trusted forwarder to ERC2771Context
    constructor(string memory _title, string memory _description, address _token, address _trustedForwarder) 
    ERC2771Context(_trustedForwarder)
    {
        title = _title;
        description = _description;
        token = IERC20(_token);
        replyCount = 0;
    }
    
    /// @dev Add the reply in the array
    function addReply(string memory _message) external returns (bool) {
        
        Reply storage newReply = replies.push();
        newReply.message = _message;
        newReply.replier = _msgSender();

        replyCount++;
        
        return true;
    }
    
    /// @notice When owner approve the reply, the token rewards to the replier
    function approveReply(uint256 replyIndex) external onlyOwner returns (bool) {
        
        isClosed = true;
        approvedReply = replyIndex;
        
        uint256 amount = token.balanceOf(address(this));
        
        token.transfer(replies[replyIndex].replier, amount);
        
        return true;
    }

    /// @dev Return all replies
    function getAllReplies() external view returns (Reply[] memory) {
        return replies;
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