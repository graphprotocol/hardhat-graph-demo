import {
  AuctionStarted,
  Bid as BidEvent,
} from "../generated/NFTAuction/NFTAuction";
import { Auction, Bid } from "../generated/schema";

export function handleAuctionStarted(event: AuctionStarted): void {
  const auction = new Auction(event.params.id.toString());

  auction.token = event.params.tokenId.toString();
  auction.creator = event.params.creator;
  auction.startPrice = event.params.startPrice;
  auction.startDate = event.params.startDate;
  auction.status = "open";
  auction.save();
}

export function handleBid(event: BidEvent): void {
  const bid = new Bid(
    `${event.params.bidder.toHexString()}-${event.params.tokenId.toString()}-${event.block.timestamp.toString()}`
  );

  bid.auction = event.params.auctionId.toString();
  bid.bidder = event.params.bidder;
  bid.amount = event.params.amount;
  bid.save();
}
