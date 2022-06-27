import hre, { ethers } from "hardhat";
import networks from "../nft-auction-subgraph/networks.json";

async function main() {
  const Auction = await ethers.getContractFactory("NFTAuction");
  const auction = Auction.attach(networks.localhost.NFTAuction.address);

  const Demo = await ethers.getContractFactory("DemoNFT");
  const demo = Demo.attach(networks.localhost.DemoNFT.address);

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

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
