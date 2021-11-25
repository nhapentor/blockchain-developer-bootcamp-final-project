const XABER = artifacts.require("XABER")

const { sender } = require("./senderHelpers.js");
const { catchRevert } = require("./exceptionsHelpers.js");

contract("xaber", function (accounts) {

    const [admin, alice, bob] = accounts

    const amount = 1000

    const emptyAddress = "0x0000000000000000000000000000000000000000";

    beforeEach(async () => {
        instance = await XABER.new(emptyAddress, await sender(admin))
    });

    /**
     * default_admin role is able to mint and burn
     */
    it("should allow default_admin role to mint and burn", async () => {

        await instance.mint(alice, amount, await sender(admin))

        assert.equal(
            await instance.balanceOf(alice),
            amount,
            `The amount must be ${amount}`
        )

        await instance.approve(admin, amount, await sender(alice))
        await instance.burnFrom(alice, amount, await sender(admin))


        assert.equal(
            await instance.balanceOf(alice),
            0,
            `The amount must be ${0}`
        )
    })

    /**
     * Can't mint if has no role
     */
    it("should not allow to mint by the one without role", async () => {
        await catchRevert(instance.mint(alice, amount, await sender(bob)));
    })

    /**
     * Can't grant role if not default_admin
     */
    it("should error when granting row by the one without default_admin role", async () => {
        await catchRevert(instance.addMinter(bob, await sender(bob)));
        await catchRevert(instance.addBurner(bob, await sender(bob)));
    })

    /**
     * Minter can mint
     */
    it("should allow minter to mint", async () => {
        
        await instance.addMinter(bob, await sender(admin))
        await instance.mint(bob, amount, await sender(bob))

        assert.equal(
            await instance.balanceOf(bob),
            amount,
            `The amount must be ${amount}`
        )
    })

    /**
     * Can't burn if has no role
     */
    it("should not allow to burn by the one without role", async () => {

        await instance.mint(bob, amount, await sender(admin))

        await catchRevert(instance.burnFrom(bob, amount, await sender(bob)));
    })

    /**
     * Burner can burn
     */
    it("should allow burner to burn", async () => {
    
        await instance.mint(bob, amount, await sender(admin))

        await instance.addBurner(alice, await sender(admin))
        await instance.approve(alice, amount, await sender(bob))

        await instance.burnFrom(bob, amount, await sender(alice))

        assert.equal(
            await instance.balanceOf(bob),
            0,
            `The amount must be ${0}`
        )
    })

})