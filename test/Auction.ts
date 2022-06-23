import { expect } from "chai";
import hre, { ethers } from "hardhat";

describe("startAuction", () => {
  describe("Token is not minted", () => {
    it("Should mint the token to itself and start an Auction", async () => {
      const Auction = await ethers.getContractFactory("NFTAuction");
      const auction = await Auction.deploy();

      await auction.deployed();

      const Demo = await ethers.getContractFactory("DemoNFT");
      const demo = await Demo.deploy();

      await demo.deployed();

      await demo.authorizeAuction(auction.address);
      await auction.setTokenAddress(demo.address);

      const tx = await auction["startAuction(uint256)"](1, {
        value: ethers.utils.parseEther("1"),
      });
      const receipt = await tx.wait();
      const owner = await demo.ownerOf(1);

      expect(receipt.events![1].event).to.equal("AuctionStarted");
      expect(owner).to.equal(auction.address);
    });
  });

  describe("Token has already been minted", () => {
    it("Should start an auction for the token", async () => {
      const Auction = await ethers.getContractFactory("NFTAuction");
      const auction = await Auction.deploy();

      await auction.deployed();

      const Demo = await ethers.getContractFactory("DemoNFT");
      const demo = await Demo.deploy();

      await demo.deployed();

      await demo.authorizeAuction(auction.address);
      await auction.setTokenAddress(demo.address);

      await hre.network.provider.request({
        method: "hardhat_impersonateAccount",
        params: [auction.address],
      });
      await hre.network.provider.send("hardhat_setBalance", [
        auction.address,
        "0x10000000000000000",
      ]);

      const auctionSigner = await ethers.getSigner(auction.address);
      const [signer] = await ethers.getSigners();
      const signedDemo = demo.connect(auctionSigner);
      await signedDemo.mintDemo(2);
      await signedDemo.transferFrom(auction.address, signer.address, 2);

      const tx = await auction.connect(signer)["startAuction(uint256,uint256)"](2, ethers.utils.parseEther("0.5"));
      const receipt = await tx.wait();

      expect(await demo.ownerOf(1)).to.equal(signer.address);
      expect(receipt.events![0].event).to.equal("AuctionStarted");
      expect(await demo.ownerOf(1)).to.equal(auction.address);
    });
  });
});
