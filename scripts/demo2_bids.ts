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

  const [, , , s4, s5, s6] = await ethers.getSigners();

  // Initial Price for this auction is 0.5 ether, the step is 0.1 ether, so the first bid should be 0.6 ether
  // Every next bid should be at least 0.1 ether higher than the previous one
  // If the user already has a bid for this auction, next bid should be only the difference between his current bid and the highest bid + bid step
  const startPrice = 0.5;
  const step = 0.1;
  let highestBid = 0.5;
  let s4Bid = 0.0;
  let s5Bid = 0.0;
  let s6Bid = 0.0;

  s4Bid = startPrice + step;
  await auction.connect(s4).bid(2, { value: ethers.utils.parseEther(`${s4Bid}`) });
  highestBid = s4Bid;
  s5Bid = highestBid + step - s5Bid;
  await auction.connect(s5).bid(2, { value: ethers.utils.parseEther(`${s5Bid}`) });
  highestBid = highestBid + s5Bid;
  s6Bid = highestBid + step - s6Bid;
  await auction.connect(s6).bid(2, { value: ethers.utils.parseEther(`${s6Bid}`) });
  highestBid = highestBid + s6Bid;
  s5Bid = highestBid + step - s5Bid;
  await auction.connect(s5).bid(2, { value: ethers.utils.parseEther(`${s5Bid}`) });
  highestBid = highestBid + s5Bid;
  s6Bid = highestBid + step - s6Bid;
  await auction.connect(s6).bid(2, { value: ethers.utils.parseEther(`${s6Bid}`) });
  highestBid = highestBid + s6Bid;
  s4Bid = highestBid + step - s4Bid;
  await auction.connect(s4).bid(2, { value: ethers.utils.parseEther(`${s4Bid}`) });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
