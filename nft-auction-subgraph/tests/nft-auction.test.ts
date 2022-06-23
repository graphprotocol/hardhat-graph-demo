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
import { Date } from "assemblyscript/std/assembly/date";
import { Auction } from "../generated/schema";
import { AuctionStarted } from "../generated/NFTAuction/NFTAuction";
import { handleAuctionStarted } from "../src/nft-auction";

describe("AuctionStarted event", () => {
  beforeAll(() => {
    const event = changetype<AuctionStarted>(newMockEvent());
    event.address = Address.fromString(
      "0x5FbDB2315678afecb367f032d93F642f64180aa3"
    );
    event.parameters = [];
    event.parameters.push(
      new ethereum.EventParam(
        "seller",
        ethereum.Value.fromAddress(
          Address.fromString("0x0000000000000000000000000000000000000001")
        )
      )
    );
    event.parameters.push(
      new ethereum.EventParam("tokenId", ethereum.Value.fromI32(2))
    );
    const now = Date.now();
    event.parameters.push(
      new ethereum.EventParam(
        "startDate",
        ethereum.Value.fromUnsignedBigInt(BigInt.fromI64(now))
      )
    );
  });
});
