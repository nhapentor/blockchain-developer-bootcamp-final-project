// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Employee.sol";

contract Employees {
    
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
    event LogNewEmployee(uint256 id, string name, string email);
    
    constructor() {
        employeeCount = 0;
    }
    
    function newEmployee(uint256 _id, string memory _name, string memory _email) 
    public 
    doesNotExist(_id, msg.sender) 
    returns (bool) 
    {
        employees[msg.sender] = Employee({
            id: _id,
            name: _name,
            email: _email
        });
        
        employeeIds[_id] = true;
        employeeCount += 1;

        emit LogNewEmployee(_id, _name, _email);
        return true;
    }
}