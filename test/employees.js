const Employees = artifacts.require("Employees");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("Employees", function (/* accounts */) {
  it("should assert true", async function () {
    await Employees.deployed();
    return assert.isTrue(true);
  })

  // it('...should store the value 89.', async () => {
  //   const simpleStorageInstance = await SimpleStorage.deployed()

  //   // Set value of 89
  //   await simpleStorageInstance.set(89, {from: accounts[0]})

  //   // Get stored value
  //   const storedData = await simpleStorageInstance.get.call()

  //   assert.equal(storedData, 89, 'The value 89 was not stored.')
  // })
});
