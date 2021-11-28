// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/// @title Contract for miniting NFT badges
/// @author Samphan Pojanasophanakul
/// @notice Allow minting of NFT tokens
contract Badges is ERC1155, AccessControl {

    /// @dev MINTER_ROLE constant
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    /// @dev The URI supplied to ERC1155 constructor will be overridden 
    constructor() ERC1155("https://bafybeiegqir22tit4zh3kry2cyq2cx3m42elp626qddfsyyofiql7jzrxy.ipfs.dweb.link/{id}.json") {
        _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
        _setupRole(MINTER_ROLE, _msgSender());
    }
    
    /// @notice Return the metadata URI for the token id `tokenId` 
    function uri(uint256 tokenId) override public pure returns (string memory) {
        return (
            string(abi.encodePacked(
                "https://bafybeiegqir22tit4zh3kry2cyq2cx3m42elp626qddfsyyofiql7jzrxy.ipfs.dweb.link/",
                Strings.toString(tokenId),
                ".json"))
        );
    }
    
    /// @notice Grant MINTER_ROLE to `minter`.
    /// @dev Used to assign MINTER_ROLE to other contract so it can mint tokens.
    function addMinter(address minter) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _setupRole(MINTER_ROLE, minter);
    }

    /// @notice Mint `amount` tokens of the token id `tokenId` to `recipient`.
    function mint(address recipient, uint256 tokenId, uint256 amount, bytes memory data) 
        external 
        onlyRole(MINTER_ROLE) 
    {
         _mint(recipient, tokenId, amount, data);
    }

    /// @dev Override the parents' method   
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC1155, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}