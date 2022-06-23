// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";
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

  await auction["startAuction(uint256)"](1, {
    value: ethers.utils.parseEther("0.01"),
  });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
