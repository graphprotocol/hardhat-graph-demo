import hre, { ethers } from "hardhat";
import networks from "../nft-auction-subgraph/networks.json";

async function main() {
  const Auction = await ethers.getContractFactory("NFTAuction");
  const auction = Auction.attach(networks.localhost.NFTAuction.address);

  const Demo = await ethers.getContractFactory("DemoNFT");
  const demo = Demo.attach(networks.localhost.DemoNFT.address);

  await hre.network.provider.send("evm_increaseTime", [5 * 24 * 60 * 60]);

  await auction.endAuction(2);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
