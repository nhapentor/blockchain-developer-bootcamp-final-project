const Employees = artifacts.require("Employees");
const Xaber = artifacts.require("Xaber");
const Badges = artifacts.require("Badges")

const { sender } = require("./senderHelpers.js");
const { catchRevert } = require("./exceptionsHelpers.js");

contract("Employees", function (accounts) {

  const [admin, alice, bob] = accounts

  const emptyAddress = "0x0000000000000000000000000000000000000000";

  const aliceProfile = {
    id: 123,
    name: "Alice",
    email: "alice@example.com",
    image: "http://www.example.com/img/alice.jpg"
  }

  const bobProfile = {
    id: 456,
    name: "Bob",
    email: "bob@example.com",
    image: "http://www.example.com/img/bob.jpg"
  }

  let instance;
  let xaberInstance;
  let badgesInstance;

  beforeEach(async () => {
    xaberInstance = await Xaber.new(emptyAddress, await sender(admin))
    badgesInstance = await Badges.new(await sender(admin))
    instance = await Employees.new(xaberInstance.address, badgesInstance.address, emptyAddress, await sender(admin));
    await xaberInstance.addMinter(instance.address, await sender(admin))
    await xaberInstance.addBurner(instance.address, await sender(admin)) 
    await badgesInstance.addMinter(instance.address, await sender(admin))
  });

  /**
   * Add a new employee.
   */
  it("should add a new employee with provided profile", async function () {
    await instance.addEmployee(aliceProfile.id, aliceProfile.name, aliceProfile.email, aliceProfile.image, await sender(alice))

    const employee = await instance.getEmployee.call(alice)

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
      employee.image,
      aliceProfile.image,
      "the image of employee does not match the expected value",
    )

    assert.equal(
      employee.email,
      aliceProfile.email,
      "the email of employee does not match the expected value",
    )
  })

  /**
   * The newly added employee should be initially funded
   */
  it("should reward the newly-onboarded employee", async function () {

    const beforeOnboardingAmount = await xaberInstance.balanceOf(bob)

    assert.equal(
      beforeOnboardingAmount,
      0,
      "The account must start with 0 token",
    );
    
    await instance.addEmployee(bobProfile.id, bobProfile.name, bobProfile.email, bobProfile.image, await sender(bob))

    const afterOnboardingAmount = await xaberInstance.balanceOf(bob)

    assert.isTrue(
      afterOnboardingAmount > beforeOnboardingAmount,
      "The newly-onboarded employee must be funded",
    );

  })

  /**
   * Attemp to add employee twice with same account
   */
  it("should error when adding new employee from the same account more than once", async function() {

    await instance.addEmployee(aliceProfile.id, aliceProfile.name, aliceProfile.email, aliceProfile.image, await sender(alice))

    await catchRevert(instance.addEmployee(bobProfile.id, bobProfile.name, bobProfile.email, bobProfile.image, await sender(alice)))
  });

  /**
   * Attemp to add employee twice with same employee id
   */
  it("should error when adding new employee with duplicated id", async function() {

    await instance.addEmployee(aliceProfile.id, aliceProfile.name, aliceProfile.email, aliceProfile.image,  await sender(alice))

    await catchRevert(instance.addEmployee(aliceProfile.id, bobProfile.name, bobProfile.email, bobProfile.image,  await sender(bob)))
  });

  /**
   * Redeem the token for a badge
   */
  it("should be able to exchange between token and badge", async function() {

    await instance.addEmployee(aliceProfile.id, aliceProfile.name, aliceProfile.email, aliceProfile.image,  await sender(alice))

    const badgeId = 2

    const aliceAmountBefore = await xaberInstance.balanceOf(alice)
    const aliceBadgeBefore = await badgesInstance.balanceOf(alice, badgeId)

    assert.equal(
      aliceBadgeBefore,
      0,
      "Employee must not habve any badge initially",
    );

    await xaberInstance.approve(instance.address, aliceAmountBefore,  await sender(alice))

    await instance.exchangeBadge(badgeId,  await sender(alice))

    const aliceAmountAfter = await xaberInstance.balanceOf(alice)
    const aliceBadgeAfter = await badgesInstance.balanceOf(alice, badgeId)

    assert.isTrue(
      aliceAmountAfter < aliceAmountBefore,
      "The employee token must be burnt",
    );

    assert.equal(
      aliceBadgeAfter,
      1,
      "Employee must hold a badge",
    );

  });

});
