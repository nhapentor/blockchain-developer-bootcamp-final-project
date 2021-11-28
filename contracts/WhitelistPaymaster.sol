//SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

pragma experimental ABIEncoderV2;

import "@opengsn/contracts/src/BasePaymaster.sol";

/// @title A paymaster contract for GSN that has whitelists for senders and targets.
contract WhitelistPaymaster is BasePaymaster {

    bool public useSenderWhitelist;
    bool public useTargetWhitelist;
    mapping (address=>bool) public senderWhitelist;
    mapping (address=>bool) public targetWhitelist;

    /// @dev To only accept the forward fron whitelisted sender
    function whitelistSender(address sender) public onlyOwner {
        senderWhitelist[sender]=true;
        useSenderWhitelist = true;
    }

    /// @dev To only relay to whitelisted target
    function whitelistTarget(address target) public onlyOwner {
        targetWhitelist[target]=true;
        useTargetWhitelist = true;
    }

    /// @dev Pre replayed call hook
    function preRelayedCall(
        GsnTypes.RelayRequest calldata relayRequest,
        bytes calldata signature,
        bytes calldata approvalData,
        uint256 maxPossibleGas
    )
    external
    override
    virtual
    returns (bytes memory context, bool revertOnRecipientRevert) {
        (relayRequest, signature, approvalData, maxPossibleGas);

        if ( useSenderWhitelist ) {
            require( senderWhitelist[relayRequest.request.from], "sender not whitelisted");
        }
        if ( useTargetWhitelist ) {
            require( targetWhitelist[relayRequest.request.to], "target not whitelisted");
        }
        return ("", false);
    }
    
    /// @dev Post relayed call hook
    function postRelayedCall(
        bytes calldata context,
        bool success,
        uint256 gasUseWithoutPost,
        GsnTypes.RelayData calldata relayData
    ) external override virtual {
        (context, success, gasUseWithoutPost, relayData);
    }
    
    /// @dev Return version of Paymaster
    function versionPaymaster() external view override virtual returns (string memory){
        return "2.2.4+opengsn.accepteverything.ipaymaster";
    }
}