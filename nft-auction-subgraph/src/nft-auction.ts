import {
  AuctionEnded,
  AuctionStarted,
  Bid as BidEvent,
  Withdraw as WithdrawEvent
} from "../generated/NFTAuction/NFTAuction";
import { Auction, Bid, Withdraw } from "../generated/schema";

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
  bid.timestamp = event.block.timestamp;
  bid.save();
}

export function handleAuctionEnded(event: AuctionEnded): void {
  const auction = Auction.load(event.params.id.toString())!;

  auction.status = "closed";
  auction.winner = event.params.winner;
  auction.finalPrice = event.params.endPrice;
  auction.endDate = event.block.timestamp;
  auction.save();
}

export function handleWithdraw(event: WithdrawEvent): void {
  const withdraw = new Withdraw(
    event.params.to.toString() +
      "-" +
      event.params.tokenId.toString() +
      "-" +
      event.params.amount.toString()
  );

  withdraw.token = event.params.tokenId.toString();
  withdraw.to = event.params.to;
  withdraw.amount = event.params.amount;
  withdraw.success = event.params.success;
  withdraw.timestamp = event.block.timestamp;
  withdraw.save();
}
