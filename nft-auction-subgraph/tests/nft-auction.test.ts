import {
  assert,
  beforeAll,
  clearStore,
  describe,
  test,
  mockIpfsFile,
  newMockEvent,
  createMockedFunction,
  afterAll,
} from "matchstick-as";
import { Address, BigInt, ethereum } from "@graphprotocol/graph-ts";
import { Auction } from "../generated/schema";
import { AuctionStarted } from "../generated/NFTAuction/NFTAuction";
import { handleAuctionStarted } from "../src/nft-auction";

describe("AuctionStarted event", () => {
  beforeAll(() => {
    const auctionStartedEvent = changetype<AuctionStarted>(newMockEvent());
    auctionStartedEvent.address = Address.fromString("0x5FbDB2315678afecb367f032d93F642f64180aa3");
  }
});
