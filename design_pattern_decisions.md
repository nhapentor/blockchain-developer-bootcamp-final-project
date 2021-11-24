# Applied Design Patterns

## Inter-Contract Execution

- The `Employees`, `DiscussionBoard` and `Discusstion` smart contracts contain functions which execute the `XABER` and `Badges` smart contracts to transact the ERC20 and ERC1155 tokens

## Inheritance and Interfaces

- Most smart contracts in this project inherit from one or more smart contracts from `OpenZeppelin` smart contract library. Besides

## Access Control Design Patterns

- The `XABER` and `Badges` smart contracts extend `Accesscontrol` from `OpenZeppelin` library to control the permission for `mint` and `burnFrom` functions. Besides, the `Discussion` smart contract also adopt the `Ownable` from the library to control the access of `approveReply` function.