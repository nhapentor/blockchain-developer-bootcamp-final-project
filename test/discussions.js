const DiscussionBoard = artifacts.require("DiscussionBoard");
const Discussion = artifacts.require("Discussion");

const Xaber = artifacts.require("Xaber");

const { catchRevert } = require("./exceptionsHelpers.js");

contract("discussions", function (accounts) {

    const [admin, alice, bob] = accounts

    const emptyAddress = "0x0000000000000000000000000000000000000000";


    describe("discussion contract", () => {

        it("should always have title and describtion", async () => {

        })

        it("should add a new reply", () => {

        })

        it("should allow only owner to approve the reply", async () => {
            const instance = await Discussion.new(tokenInstance.address, emptyAddress);
        })

        it("should not allow approving self reply", () => {

        })

        it("should transfer token to approved replier", () => {

        })

    })


    describe("discussion board", () => {

        it("should create a new discussion"), async () => {

        }

        it("should be able to retrived the created discussion", async () => {
            const instance = await Discussion.new(tokenInstance.address, emptyAddress);
        })

        it("should not allow create a new discussion with reward less than 1", async () => {

        })

        it("should set ownership of discussion to the initiator", () => {

        })

        it("should store the reward in the discussion contract", () => {

        })

    })


})