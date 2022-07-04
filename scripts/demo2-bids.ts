import { ethers } from "hardhat";
import networks from "../nft-auction-subgraph/networks.json";

async function main() {
  const Auction = await ethers.getContractFactory("NFTAuction");
  const auction = Auction.attach(networks.localhost.NFTAuction.address);

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
  console.log(s4Bid);
  await auction
    .connect(s4)
    .bid(2, { value: ethers.utils.parseEther(`${s4Bid.toFixed(2)}`) });
  highestBid = s4Bid;
  s5Bid = highestBid + step - s5Bid;
  console.log(s5Bid);
  await auction
    .connect(s5)
    .bid(2, { value: ethers.utils.parseEther(`${s5Bid.toFixed(2)}`) });
  highestBid = highestBid + s5Bid;
  s6Bid = highestBid + step - s6Bid;
  console.log(s6Bid);
  await auction
    .connect(s6)
    .bid(2, { value: ethers.utils.parseEther(`${s6Bid.toFixed(2)}`) });
  highestBid = highestBid + s6Bid;
  s5Bid = highestBid + step - s5Bid;
  console.log(s5Bid);
  await auction
    .connect(s5)
    .bid(2, { value: ethers.utils.parseEther(`${s5Bid.toFixed(2)}`) });
  highestBid = highestBid + s5Bid;
  s6Bid = highestBid + step - s6Bid;
  console.log(s6Bid);
  await auction
    .connect(s6)
    .bid(2, { value: ethers.utils.parseEther(`${s6Bid.toFixed(2)}`) });
  highestBid = highestBid + s6Bid;
  s4Bid = highestBid + step - s4Bid;
  console.log(s4Bid);
  await auction
    .connect(s4)
    .bid(2, { value: ethers.utils.parseEther(`${s4Bid.toFixed(2)}`) });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
