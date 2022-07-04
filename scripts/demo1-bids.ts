import { ethers } from "hardhat";
import networks from "../nft-auction-subgraph/networks.json";

async function main() {
  const Auction = await ethers.getContractFactory("NFTAuction");
  const auction = Auction.attach(networks.localhost.NFTAuction.address);

  const [s1, s2, s3] = await ethers.getSigners();

  // Initial Price (which is also the first bid made by the address (s1) that has opened the auction) for this auction is 0.1 ether, the step is 0.1 ether, so the first bid should be 0.2 ether
  // Every next bid should be at least 0.1 ether higher than the previous one
  // If the user already has a bid for this auction, next bid should be only the difference between his current bid and the highest bid + bid step
  const step = 0.1;
  let highestBid = 0.1;
  let s1Total = 0.1;
  let s2Total = 0.0;
  let s3Total = 0.0;

  let s2Bid = highestBid + step - s2Total; // 0.2
  await auction
    .connect(s2)
    .bid(1, { value: ethers.utils.parseEther(`${s2Bid.toFixed(2)}`) });
  s2Total = s2Total + s2Bid; // 0.2
  highestBid = s2Total; // 0.2

  let s1Bid = highestBid + step - s1Total; // 0.2
  await auction
    .connect(s1)
    .bid(1, { value: ethers.utils.parseEther(`${s1Bid.toFixed(2)}`) });
  s1Total = s1Total + s1Bid; // 0.3
  highestBid = s1Total; // 0.3

  s2Bid = highestBid + step - s2Total; // 0.2
  await auction
    .connect(s2)
    .bid(1, { value: ethers.utils.parseEther(`${s2Bid.toFixed(2)}`) });
  s2Total = s2Total + s2Bid; // 0.4
  highestBid = s2Total; // 0.4

  let s3Bid = highestBid + step - s3Total; // 0.5
  await auction
    .connect(s3)
    .bid(1, { value: ethers.utils.parseEther(`${s3Bid.toFixed(2)}`) });
  s3Total = s3Total + s3Bid; // 0.5
  highestBid = s3Total; // 0.5

  s2Bid = highestBid + step - s2Total; // 0.2
  await auction
    .connect(s2)
    .bid(1, { value: ethers.utils.parseEther(`${s2Bid.toFixed(2)}`) });
  s2Total = s2Total + s2Bid; // 0.6
  highestBid = s2Total; // 0.6

  s3Bid = highestBid + step - s3Total; // 0.2
  await auction
    .connect(s3)
    .bid(1, { value: ethers.utils.parseEther(`${s3Bid.toFixed(2)}`) });
  s3Total = s3Total + s3Bid; // 0.7
  highestBid = s3Total; // 0.7

  s1Bid = highestBid + step - s1Total; // 0.5
  await auction
    .connect(s1)
    .bid(1, { value: ethers.utils.parseEther(`${s1Bid.toFixed(2)}`) });
  s1Total = s1Total + s1Bid; // 0.8
  highestBid = s1Total; // 0.8
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
