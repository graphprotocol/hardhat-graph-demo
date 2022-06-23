// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import hre, { ethers } from "hardhat";
import networks from "../nft-auction-subgraph/networks.json";

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy

  const Auction = await ethers.getContractFactory("NFTAuction");
  const auction = Auction.attach(networks.localhost.NFTAuction.address);

  // await auction.deployed();

  const Demo = await ethers.getContractFactory("DemoNFT");
  const demo = Demo.attach(networks.localhost.DemoNFT.address);

  // await demo.deployed();

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

  await demo.connect(signer).approve(auction.address, 2);
  await auction
    .connect(signer)
    ["startAuction(uint256,uint256)"](2, ethers.utils.parseEther("0.5"));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
