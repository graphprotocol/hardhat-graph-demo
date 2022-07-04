import { ethers } from "hardhat";
import networks from "../nft-auction-subgraph/networks.json";

async function main() {
  const Auction = await ethers.getContractFactory("NFTAuction");
  const auction = Auction.attach(networks.localhost.NFTAuction.address);

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
  await auction
    .connect(s1)
    .bid(1, { value: ethers.utils.parseEther(`${s1Bid.toFixed(2)}`) });
  highestBid = s1Bid;
  s2Bid = highestBid + step - s2Bid;
  await auction
    .connect(s2)
    .bid(1, { value: ethers.utils.parseEther(`${s2Bid.toFixed(2)}`) });
  highestBid = highestBid + s2Bid;
  s3Bid = highestBid + step - s3Bid;
  await auction
    .connect(s3)
    .bid(1, { value: ethers.utils.parseEther(`${s3Bid.toFixed(2)}`) });
  highestBid = highestBid + s3Bid;
  s2Bid = highestBid + step - s2Bid;
  await auction
    .connect(s2)
    .bid(1, { value: ethers.utils.parseEther(`${s2Bid.toFixed(2)}`) });
  highestBid = highestBid + s2Bid;
  s3Bid = highestBid + step - s3Bid;
  await auction
    .connect(s3)
    .bid(1, { value: ethers.utils.parseEther(`${s3Bid.toFixed(2)}`) });
  highestBid = highestBid + s3Bid;
  s1Bid = highestBid + step - s1Bid;
  await auction
    .connect(s1)
    .bid(1, { value: ethers.utils.parseEther(`${s1Bid.toFixed(2)}`) });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
