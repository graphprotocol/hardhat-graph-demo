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

  const [s1, s2, s3] = await ethers.getSigners();

  // Initial Price for this auction is 0.1 ether, the step is 0.1 ether, so the first bid should be 0.2 ether
  // Every next bid should be at least 0.1 ether higher than the previous one
  // If the user already has a bid for this auction, next bid should be only the difference between his current bid and the highest bid + bid step
  const startPrice = 0.1;
  const step = 0.1;
  let highestBid = 0.1;
  let s1Bid = 0.0;
  let s2Bid = 0.0;
  let s3Bid = 0.0;

  s1Bid = startPrice + step;
  await auction.connect(s1).bid(1, { value: ethers.utils.parseEther(`${s1Bid}`) });
  highestBid = s1Bid;
  s2Bid = highestBid + step - s2Bid;
  await auction.connect(s2).bid(1, { value: ethers.utils.parseEther(`${s2Bid}`) });
  highestBid = highestBid + s2Bid;
  s3Bid = highestBid + step - s3Bid;
  await auction.connect(s3).bid(1, { value: ethers.utils.parseEther(`${s3Bid}`) });
  highestBid = highestBid + s3Bid;
  s2Bid = highestBid + step - s2Bid;
  await auction.connect(s2).bid(1, { value: ethers.utils.parseEther(`${s2Bid}`) });
  highestBid = highestBid + s2Bid;
  s3Bid = highestBid + step - s3Bid;
  await auction.connect(s3).bid(1, { value: ethers.utils.parseEther(`${s3Bid}`) });
  highestBid = highestBid + s3Bid;
  s1Bid = highestBid + step - s1Bid;
  await auction.connect(s1).bid(1, { value: ethers.utils.parseEther(`${s1Bid}`) });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
