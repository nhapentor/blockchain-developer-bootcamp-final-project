// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/metatx/ERC2771Context.sol";

/**
* @title Contract of the XABER token
* @author Samphan Pojanasophanakul
* @notice A mintable and burnable ERC20 token
* @dev Inherit from ERC2771Context to allow calling from trusted forwarder 
* on behalf of sender
*/
contract XABER is ERC20, AccessControl, ERC2771Context { 

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");

    /// @dev Pass a trusted forwarder to ERC2771Context     
    constructor(address trustedForwarder) ERC20("XABER", "XBR") 
    ERC2771Context(trustedForwarder){
        _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
        _setupRole(MINTER_ROLE, _msgSender());
        _setupRole(BURNER_ROLE, _msgSender());
    }

    /// @notice Grant MINTER_ROLE to `minter`.
    /// @dev Used to assign MINTER_ROLE to other contract so it can mint tokens.
    function addMinter(address minter) external onlyRole(DEFAULT_ADMIN_ROLE) 
    {
        _setupRole(MINTER_ROLE, minter);
    }

    /// @notice Grant BURNER_ROLE to `burner`.
    /// @dev Used to assign BURNER_ROLE to other contract so it can burn tokens.
    function addBurner(address burner) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _setupRole(BURNER_ROLE, burner);
    }

    /// @notice Mint `amount` tokens to the `recipient`.
    function mint(address recipient, uint256 amount) external onlyRole(MINTER_ROLE) {
        _mint(recipient, amount);
    }

    /// @notice Destroys `amount` tokens from `account`, deducting from the caller's allowance. 
    function burnFrom(address account, uint256 amount) public onlyRole(BURNER_ROLE) {
        uint256 currentAllowance = allowance(account, _msgSender());
        require(currentAllowance >= amount, "ERC20: burn amount exceeds allowance");
        unchecked {
            _approve(account, _msgSender(), currentAllowance - amount);
        }        
        _burn(account, amount);
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

