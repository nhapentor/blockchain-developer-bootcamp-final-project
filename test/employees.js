const Employees = artifacts.require("Employees");
const Xaber = artifacts.require("Xaber");

const { catchRevert } = require("./exceptionsHelpers.js");

contract("Employees", function (accounts) {

  const [admin, alice, bob] = accounts

  const aliceProfile = {
    id: 123,
    name: "Alice",
    email: "alice@example.com"
  }

  const bobProfile = {
    id: 456,
    name: "Bob",
    email: "bob@example.com"
  }

  let instance;

  let tokenInstance;

  beforeEach(async () => {
    tokenInstance = await Xaber.deployed()
    instance = await Employees.new(tokenInstance.address);
    await tokenInstance.addMinter(instance.address)
  });

  it("should add a new employee with provided profile", async function () {
    await instance.newEmployee(aliceProfile.id, aliceProfile.name, aliceProfile.email, { from: alice })

    const count = await instance.employeeCount.call()

    assert.equal(
      count,
      1,
      "The number of employee(s) must be 1",
    );

    const employee = await instance.employees.call(alice)

    assert.equal(
      employee.id,
      aliceProfile.id,
      "the id of employee does not match the expected value",
    )

    assert.equal(
      employee.name,
      aliceProfile.name,
      "the name of employee does not match the expected value",
    )

    assert.equal(
      employee.email,
      aliceProfile.email,
      "the email of employee does not match the expected value",
    )
  })

  it("should reward the newly-onboarded employee", async function () {

    const beforeOnboardingAmount = await tokenInstance.balanceOf(bob)

    assert.equal(
      beforeOnboardingAmount,
      0,
      "The account must start with 0 token",
    );
    
    await instance.newEmployee(bobProfile.id, bobProfile.name, bobProfile.email, { from: bob })

    const afterOnboardingAmount = await tokenInstance.balanceOf(bob)

    assert.isTrue(
      afterOnboardingAmount > beforeOnboardingAmount,
      0,
      "The newly-onboarded employee must be funded",
    );

  })

  it("should error create new employee from the same account more than once", async function() {

    await instance.newEmployee(aliceProfile.id, aliceProfile.name, aliceProfile.email, { from: alice })

    await catchRevert(instance.newEmployee(bobProfile.id, bobProfile.name, bobProfile.email, { from: alice }));
  });

  it("should error create new employee with duplicated id", async function() {

    await instance.newEmployee(aliceProfile.id, aliceProfile.name, aliceProfile.email, { from: alice })

    await catchRevert(instance.newEmployee(aliceProfile.id, bobProfile.name, bobProfile.email, { from: bob }));
  });

});
