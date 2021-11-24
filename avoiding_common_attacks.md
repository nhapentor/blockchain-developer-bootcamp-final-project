# Avoided Common Attacts

## Using Specific Compiler Pragma

Lock pragmas to `0.8.10` to ensure that contracts do not accidentally get deployed using the compiler version that might introduce bugs that affect the contract system negatively.

## Use Modifiers Only for Validation 

Every modifiers in smart contract(s) only validate data with `require` statements.