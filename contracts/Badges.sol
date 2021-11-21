// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract Badges is ERC1155, AccessControl {

    bytes32 public constant URI_SETTER_ROLE = keccak256("URI_SETTER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    
    mapping (uint256 => string) private _uris;

    constructor() ERC1155("https://bafybeifgqgbx665w5aenxzalb6qd3mmsgqorkgooctjwnnnkymzgzrealu.ipfs.dweb.link/{id}.json") {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(URI_SETTER_ROLE, msg.sender);
        _setupRole(MINTER_ROLE, msg.sender);
    }
    
    function uri(uint256 tokenId) override public pure returns (string memory) {
        return (
            string(abi.encodePacked(
                "https://bafybeifgqgbx665w5aenxzalb6qd3mmsgqorkgooctjwnnnkymzgzrealu.ipfs.dweb.link/",
                Strings.toString(tokenId),
                ".json"))
        );
    }
    
    function addMinter(address minter) public {
        _setupRole(MINTER_ROLE, minter);
    }

    function mint(address account, uint256 id, uint256 amount, bytes memory data)
        public
        onlyRole(MINTER_ROLE)
    {
        _mint(account, id, amount, data);
    }
    
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC1155, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}