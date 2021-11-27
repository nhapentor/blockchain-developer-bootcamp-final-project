const DiscussionBoard = artifacts.require("DiscussionBoard");

const Xaber = artifacts.require("Xaber");

const { sender } = require("./senderHelpers.js");
const { catchRevert } = require("./exceptionsHelpers.js");

contract("DiscussionBoard", function (accounts) {

    const [admin, alice, bob] = accounts

    const emptyAddress = "0x0000000000000000000000000000000000000000";

    const rewardAmount = 1000

    let xaberInstance
    let instance

    beforeEach(async () => {
        xaberInstance = await Xaber.new(emptyAddress, await sender(admin))
        instance = await DiscussionBoard.new(xaberInstance.address, emptyAddress, await sender(admin)) 

        await xaberInstance.mint(admin, rewardAmount, await sender(admin))
        await xaberInstance.approve(instance.address, rewardAmount, await sender(admin))
    })

    /**
     * Ensure a new discussion is created and added to list with correct reward and owner
     */
    it("should be able to have a new discussion", async () => {

        await instance.createDiscussion("title", "description", rewardAmount) 
        assert.equal(
            (await instance.getAllDiscussions.call()).length,
            1,
            "the number of discussions does not match the expected value",
        )

        const discussion =  (await instance.getAllDiscussions.call())[0]

        assert.equal(
            await xaberInstance.balanceOf(discussion),
            rewardAmount,
            "the reward of discussions does not match the expected value",
        )
        
    })

    /**
     * The reward set for reply get approved must be more than 0
     */
    it("should have reward", async () => {
        await catchRevert(instance.createDiscussion("title", "description", 0))
    })

})