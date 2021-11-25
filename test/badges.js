const Badges = artifacts.require("Badges")

const { sender } = require("./senderHelpers.js");
const { catchRevert } = require("./exceptionsHelpers.js");

contract("badges", function (accounts) {

    const [admin, alice, bob] = accounts

    beforeEach(async () => {
        instance = await Badges.new(await sender(admin))
    });

    /**
     * default_admin role is able to mint
     */
    it("should allow default_admin role to mint", async () => {

        await instance.mint(alice, 1, 1, "0x0", await sender(admin))

        assert.equal(
            await instance.balanceOf(alice, 1),
            1,
            "The amount must be 1"
        )
    })

    /**
     * Can't mint if has no role
     */
    it("should not allow to mint by the one without role", async () => {
        await catchRevert(instance.mint(alice, 1, 1, "0x0", await sender(bob)));
    })

    // /**
    //  * Can't grant role if not default_admin
    //  */
    it("should error when granting row by the one without default_admin role", async () => {
        await catchRevert(instance.addMinter(bob, await sender(bob)));
    })

    /**
     * Minter can mint
     */
        it("should allow minter to mint", async () => {
        
        await instance.addMinter(bob, await sender(admin))
        await instance.mint(bob, 1, 1, "0x0", await sender(bob))

        assert.equal(
            await instance.balanceOf(bob, 1),
            1,
            "The amount must be 1"
        )
    })

})