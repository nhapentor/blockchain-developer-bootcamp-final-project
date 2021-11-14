// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./XABER.sol";
import "./Employee.sol";

import "@openzeppelin/contracts/metatx/ERC2771Context.sol";

contract Employees is ERC2771Context {
    
    XABER tokenContract;

    mapping(address => Employee) public employees;
    mapping(uint256 => bool) public employeeIds;

    uint256 public employeeCount;

    modifier doesNotExist(uint256 _id, address _address)  {
        require(_id > 0 && !employeeIds[_id]  && employees[_address].id == 0);
        _;
    }
    
    /*
     * Events
     */
    event LogEmployeeAdded(uint256 id, string name, string email);
    
    constructor(address _tokenContract, address _trustedForwarder) 
    ERC2771Context(_trustedForwarder)
    {
        tokenContract = XABER(_tokenContract);
        employeeCount = 0;
    }
    
    function addEmployee(uint256 _id, string memory _name, string memory _email) 
    public 
    doesNotExist(_id, _msgSender()) 
    returns (bool) 
    {
        employees[_msgSender()] = Employee({
            id: _id,
            name: _name,
            email: _email
        });
        
        employeeIds[_id] = true;
        employeeCount += 1;

        tokenContract.mint(_msgSender(), 10000000000000000000);

        emit LogEmployeeAdded(_id, _name, _email);
        return true;
    }
}