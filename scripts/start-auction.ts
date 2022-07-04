import { ethers } from "hardhat";
import networks from "../nft-auction-subgraph/networks.json";

async function main() {
  const Auction = await ethers.getContractFactory("NFTAuction");
  const auction = Auction.attach(networks.localhost.NFTAuction.address);

  const Demo = await ethers.getContractFactory("DemoNFT");
  const demo = Demo.attach(networks.localhost.DemoNFT.address);

  await demo.authorizeAuction(auction.address);
  await auction.setTokenAddress(demo.address);

  await auction["startAuction(uint256)"](1, {
    value: ethers.utils.parseEther("0.1"),
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
