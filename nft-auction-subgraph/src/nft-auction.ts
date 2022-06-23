import { AuctionStarted } from "../generated/NFTAuction/NFTAuction";
import { Auction } from "../generated/schema";

export function handleAuctionStarted(event: AuctionStarted): void {
  const auction = new Auction(
    `${event.params.seller.toHexString()}-${event.params.tokenId.toString()}`
  );

  auction.token = event.params.tokenId.toString();
  auction.seller = event.params.seller;
  auction.startPrice = event.params.startPrice;
  auction.startDate = event.params.startDate;
  auction.status = "open";
  auction.save();
}
