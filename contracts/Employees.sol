// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

import "./XABER.sol";
import "./Badges.sol";
import "./Employee.sol";

import "@openzeppelin/contracts/metatx/ERC2771Context.sol";

/// @title A smart contract for main interactions with employees
/// @author Samphan Pojanasophanakul
/// @notice Handle employee records and redemption of badges
contract Employees is ERC2771Context {    
    
    uint256 private constant NOOB = 1;
    uint256 private constant ROOKIE = 2;
    uint256 private constant NOVICE = 3;
    uint256 private constant COMMON = 4;
    uint256 private constant MAJOR = 5;
    uint256 private constant MASTER = 6;

    uint256 private constant ONBOARD_REWARD = 10000000000000000000;

    XABER private tokenContract;
    Badges private badgesContract;

    uint256[] private badgeIds;
    mapping(uint256 => uint256) private badgeExchangeRates;    

    mapping(address => Employee) private employees;
    mapping(uint256 => bool) private employeeIds;

    modifier mustNotExist(uint256 _id, address _address)  {
        require(_id > 0 && !employeeIds[_id]  && employees[_address].id == 0, "Employee with this account already exists");
        _;
    }
        
    modifier validateExchangeCriterias(address _buyer, uint256 badgeId)  {
        require(tokenContract.allowance(_buyer, address(this)) >= badgeExchangeRates[badgeId], "Insufficient allowance to spend token");
        require(tokenContract.balanceOf(_buyer) >= badgeExchangeRates[badgeId], "Insufficient token to exchange");
        require(badgesContract.balanceOf(_buyer, badgeId) == 0, "Allow holding amount only 1 for each badge");
        _;
    }


    event LogEmployeeAdded(uint256 id, string name, string email);
    
    /// @dev Pass a trusted forwarder to ERC2771Context
    constructor(address _tokenContract, address _badgesContract, address _trustedForwarder) 
    ERC2771Context(_trustedForwarder)
    {
        tokenContract = XABER(_tokenContract);
        badgesContract = Badges(_badgesContract);

        badgeIds = [NOOB, ROOKIE, NOVICE, COMMON, MAJOR, MASTER];

        badgeExchangeRates[NOOB] = 5000000000000000000;
        badgeExchangeRates[ROOKIE] = 10000000000000000000;
        badgeExchangeRates[NOVICE] = 15000000000000000000;
        badgeExchangeRates[COMMON] = 30000000000000000000;
        badgeExchangeRates[MAJOR] = 50000000000000000000;
        badgeExchangeRates[MASTER]= 100000000000000000000;

    }
    
    /// @notice Create a new Employee entry
    /// @dev Store mapping of sender address to the employee entry and keep track of employee id in array
    function addEmployee(uint256 _id, string memory _name, string memory _email, string memory _image) 
    public 
    mustNotExist(_id, _msgSender()) returns (bool) 
    {        
        Employee storage newEmployee = employees[_msgSender()];
        newEmployee.id = _id;
        newEmployee.name = _name;
        newEmployee.email = _email;
        newEmployee.image = _image;
        
        employeeIds[_id] = true;

        tokenContract.mint(_msgSender(), ONBOARD_REWARD);

        emit LogEmployeeAdded(_id, _name, _email);
        return true;
    }

    /// @notice Return the employee entry
    function getEmployee(address account) external view returns (Employee memory) {
        return employees[account];
    }
    
    /// @dev Return the list of supported token id to mint NFT 
    function getAvailableBadges() public view returns (uint256[] memory) {                        
        return badgeIds;
    }

    /// @dev Return the amount of XABER token required to mint a specific badge    
    function getBadgeExchangeRate (uint256 badgeId) public view returns (uint256) {
            return badgeExchangeRates[badgeId];
    }
    
    /// @notice Spend XABER token for badge redemption
    function exchangeBadge (uint256 badgeId) 
    public 
    validateExchangeCriterias(_msgSender(), badgeId)
    returns (bool) 
    {
        

        tokenContract.burnFrom(_msgSender(), badgeExchangeRates[badgeId]);
        badgesContract.mint(_msgSender(), badgeId, 1, "");        
        employees[_msgSender()].badges.push(badgeId);

        return true;
    }
}