//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

pragma experimental ABIEncoderV2;

import "@opengsn/contracts/src/BasePaymaster.sol";

///a sample paymaster that has whitelists for senders and targets.
/// - if at least one sender is whitelisted, then ONLY whitelisted senders are allowed.
/// - if at least one target is whitelisted, then ONLY whitelisted targets are allowed.
contract WhitelistPaymaster is BasePaymaster {

    bool public useSenderWhitelist;
    bool public useTargetWhitelist;
    mapping (address=>bool) public senderWhitelist;
    mapping (address=>bool) public targetWhitelist;

    function whitelistSender(address sender) public onlyOwner {
        senderWhitelist[sender]=true;
        useSenderWhitelist = true;
    }
    function whitelistTarget(address target) public onlyOwner {
        targetWhitelist[target]=true;
        useTargetWhitelist = true;
    }

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
    
    function postRelayedCall(
        bytes calldata context,
        bool success,
        uint256 gasUseWithoutPost,
        GsnTypes.RelayData calldata relayData
    ) external override virtual {
        (context, success, gasUseWithoutPost, relayData);
    }
    
    function versionPaymaster() external view override virtual returns (string memory){
        return "2.2.4+opengsn.accepteverything.ipaymaster";
    }
}