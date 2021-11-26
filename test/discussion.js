const Discussion = artifacts.require("Discussion");
const Xaber = artifacts.require("Xaber");

const { sender } = require("./senderHelpers.js");
const { catchRevert } = require("./exceptionsHelpers.js");

contract("Discussion", function (accounts) {

    const [admin, alice, bob] = accounts

    const emptyAddress = "0x0000000000000000000000000000000000000000";

    const title = "Lorem Ipsum"
    const description = "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit..."
    const message1 = "Nam aliquet commodo quam, eget ullamcorper risus elementum in."
    const message2 = "Phasellus sed ante in purus efficitur aliquam at et leo."

    let xaberInstance

    beforeEach(async () => {
        xaberInstance = await Xaber.new(emptyAddress, await sender(admin))
    });

    /**
     * Check the title and description of created discussion
     */
    it("should contain the provided title and describtion", async () => {
        
        const instance = await Discussion.new(title, description, xaberInstance.address, emptyAddress, await sender(alice))

        assert.equal(
            await instance.title.call(),
            title,
            "the title of discussion does not match the expected value",
        )

        assert.equal(
            await instance.description.call(),
            description,
            "the description of discussion does not match the expected value",
        )

    })

    /**
     * Check the replies
     */
    it("should new replies", async () => {

        const instance = await Discussion.new(title, description, xaberInstance.address, emptyAddress, await sender(alice))

        await instance.addReply(message1, await sender(bob))
        await instance.addReply(message2, await sender(alice))

        assert.equal(
            await instance.replyCount.call(),
            2,
            "the number of replies does not match the expected value",
        )

        const replies = await instance.getAllReplies.call()

        assert.equal(
            replies[0].message,
            message1,
            "the first reply message does not match the expected value",
        )

        assert.equal(
            replies[0].replier,
            bob,
            "the first replier does not match the expected value",
        )

        assert.equal(
            replies[1].message,
            message2,
            "the second reply message does not match the expected value",
        )

        assert.equal(
            replies[1].replier,
            alice,
            "the second replier does not match the expected value",
        )
    })

    /**
     * Revert if the one who approve reply is not owner
     */    
    it("should allow only owner to approve the reply", async () => {

        const instance = await Discussion.new(title, description, xaberInstance.address, emptyAddress, await sender(alice))

        await instance.addReply(message1, await sender(bob))
        await instance.addReply(message2, await sender(alice))

        await catchRevert(instance.approveReply(1, await sender(bob)))
  
    })

    /**
     * Allow to approve only the reply that not self reply
     */  
    it("should not allow approving self reply", async () => {

        const instance = await Discussion.new(title, description, xaberInstance.address, emptyAddress, await sender(alice))

        await instance.addReply(message1, await sender(bob))
        await instance.addReply(message2, await sender(alice))

        await catchRevert(instance.approveReply(1, await sender(alice)))
    })

    /**
     * When a reply is approved, the discussion is closed and the reward transfer to approved replier
     */  
    it("should be able to approve a reply", async () => {
        const instance = await Discussion.new(title, description, xaberInstance.address, emptyAddress, await sender(alice))
        await xaberInstance.mint(instance.address, 1000)

        await instance.addReply(message1, await sender(alice))
        await instance.addReply(message2, await sender(bob))
        await instance.approveReply(1, await sender(alice))

        assert.equal(
            await instance.approvedReply.call(),
            1,
            "The approvedReply is not set correctly"
        )

        assert.isTrue(
            await instance.isClosed.call(),
            "The discussion must be closed after approving a reply"
        )

        assert.equal(
            await xaberInstance.balanceOf(bob),
            1000,
            "The replier don't get the reward"
        )

    })

})