import { expect } from "chai";
import { ethers } from "hardhat";
import { time } from "@nomicfoundation/hardhat-network-helpers";
import { BotWish } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("BotWish", function () {
  let botWish: BotWish;
  let owner: HardhatEthersSigner;
  let user1: HardhatEthersSigner;
  let user2: HardhatEthersSigner;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();
    const BotWishFactory = await ethers.getContractFactory("BotWish");
    botWish = await BotWishFactory.deploy();
    await botWish.waitForDeployment();
  });

  describe("addWish", function () {
    it("A user can add a wish", async function () {
      await expect(botWish.connect(user1).addWish("Learn Solidity", "Study smart contracts"))
        .to.not.be.reverted;

      const wishes = await botWish.connect(user1).getMyWishes();
      expect(wishes.length).to.equal(1);
    });

    it("The title and description are stored correctly", async function () {
      const title = "Visit Tokyo";
      const desc = "Spend two weeks exploring Shibuya and Akihabara.";
      await botWish.connect(user1).addWish(title, desc);

      const wish = await botWish.getWish(user1.address, 0);
      expect(wish.title).to.equal(title);
      expect(wish.description).to.equal(desc);
    });

    it("The creator address is correct", async function () {
      await botWish.connect(user1).addWish("Build a dApp", "A cool Web3 dApp");
      const wish = await botWish.getWish(user1.address, 0);
      expect(wish.owner).to.equal(user1.address);
    });

    it("The creation timestamp is recorded", async function () {
      const tx = await botWish.connect(user1).addWish("Save for holiday", "");
      const receipt = await tx.wait();
      const block = await ethers.provider.getBlock(receipt!.blockNumber);

      const wish = await botWish.getWish(user1.address, 0);
      expect(wish.createdAt).to.equal(block!.timestamp);
    });

    it("A new wish starts as incomplete", async function () {
      await botWish.connect(user1).addWish("Read a book", "Mastering Ethereum");
      const wish = await botWish.getWish(user1.address, 0);
      expect(wish.completed).to.be.false;
    });

    it("Empty titles revert", async function () {
      await expect(
        botWish.connect(user1).addWish("", "Description without title")
      ).to.be.revertedWithCustomError(botWish, "EmptyTitle");
    });

    it("Titles exceeding 80 characters revert", async function () {
      const longTitle = "a".repeat(81);
      await expect(
        botWish.connect(user1).addWish(longTitle, "Valid description")
      ).to.be.revertedWithCustomError(botWish, "TitleTooLong");

      // Exactly 80 characters should succeed
      const valid80Title = "a".repeat(80);
      await expect(
        botWish.connect(user1).addWish(valid80Title, "Valid description")
      ).to.not.be.reverted;
    });

    it("Descriptions exceeding 280 characters revert", async function () {
      const longDesc = "d".repeat(281);
      await expect(
        botWish.connect(user1).addWish("Valid Title", longDesc)
      ).to.be.revertedWithCustomError(botWish, "DescriptionTooLong");

      // Exactly 280 characters should succeed
      const valid280Desc = "d".repeat(280);
      await expect(
        botWish.connect(user1).addWish("Valid Title", valid280Desc)
      ).to.not.be.reverted;
    });

    it("WishAdded events contain the correct information", async function () {
      const title = "First Event Wish";
      const desc = "Check event fields";

      await expect(botWish.connect(user1).addWish(title, desc))
        .to.emit(botWish, "WishAdded")
        .withArgs(1, user1.address, title, desc, (timestamp: any) => {
          return typeof timestamp === "bigint" || typeof timestamp === "number";
        });
    });
  });

  describe("Wishlists separation across wallets", function () {
    it("Different wallets have separate wishlists", async function () {
      await botWish.connect(user1).addWish("User1 Wish 1", "Desc 1");
      await botWish.connect(user1).addWish("User1 Wish 2", "Desc 2");

      await botWish.connect(user2).addWish("User2 Wish 1", "Desc A");

      const user1Wishes = await botWish.connect(user1).getMyWishes();
      const user2Wishes = await botWish.connect(user2).getMyWishes();

      expect(user1Wishes.length).to.equal(2);
      expect(user2Wishes.length).to.equal(1);
      expect(user1Wishes[0].title).to.equal("User1 Wish 1");
      expect(user2Wishes[0].title).to.equal("User2 Wish 1");

      const count1 = await botWish.getWishCount(user1.address);
      const count2 = await botWish.getWishCount(user2.address);
      expect(count1).to.equal(2);
      expect(count2).to.equal(1);
    });
  });

  describe("completeWish", function () {
    let wishId: bigint;

    beforeEach(async function () {
      const tx = await botWish.connect(user1).addWish("Complete me", "Target wish");
      await tx.wait();
      wishId = 1n;
    });

    it("A user can complete their own wish", async function () {
      await expect(botWish.connect(user1).completeWish(wishId)).to.not.be.reverted;

      const wish = await botWish.getWish(user1.address, 0);
      expect(wish.completed).to.be.true;
    });

    it("Another wallet cannot complete someone else's wish", async function () {
      await expect(
        botWish.connect(user2).completeWish(wishId)
      ).to.be.revertedWithCustomError(botWish, "NotWishOwner");
    });

    it("A wish cannot be completed twice", async function () {
      await botWish.connect(user1).completeWish(wishId);

      await expect(
        botWish.connect(user1).completeWish(wishId)
      ).to.be.revertedWithCustomError(botWish, "WishAlreadyCompleted");
    });

    it("Nonexistent wishes revert", async function () {
      const nonexistentId = 999n;
      await expect(
        botWish.connect(user1).completeWish(nonexistentId)
      ).to.be.revertedWithCustomError(botWish, "WishNotFound");
    });

    it("WishCompleted events contain the correct information", async function () {
      await expect(botWish.connect(user1).completeWish(wishId))
        .to.emit(botWish, "WishCompleted")
        .withArgs(wishId, user1.address, (timestamp: any) => {
          return typeof timestamp === "bigint" || typeof timestamp === "number";
        });
    });
  });

  describe("getWish and getWishCount", function () {
    it("Invalid wish indexes revert", async function () {
      await expect(
        botWish.getWish(user1.address, 0)
      ).to.be.revertedWithCustomError(botWish, "InvalidWishIndex");

      await botWish.connect(user1).addWish("Wish 1", "Desc");

      // Index 0 exists, index 1 does not
      expect((await botWish.getWish(user1.address, 0)).title).to.equal("Wish 1");
      await expect(
        botWish.getWish(user1.address, 1)
      ).to.be.revertedWithCustomError(botWish, "InvalidWishIndex");
    });
  });
});
