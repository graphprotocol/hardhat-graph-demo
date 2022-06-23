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
    event.parameters.push(
      new ethereum.EventParam(
        "startDate",
        ethereum.Value.fromUnsignedBigInt(BigInt.fromI64(11111111111))
      )
    );
    event.parameters.push(
      new ethereum.EventParam("startPrice", ethereum.Value.fromUnsignedBigInt(BigInt.fromI64(500000000000000000)))
    )

    handleAuctionStarted(event);
  });

  test("AuctionStarted event should create a new auction", () => {
    assert.entityCount("Auction", 1);
  });

  test("Auction should have the correct values", () => {
    const auctionId = "0x0000000000000000000000000000000000000001-2";
    assert.fieldEquals(
      "Auction",
      auctionId,
      "seller",
      "0x0000000000000000000000000000000000000001"
    );
    assert.fieldEquals("Auction", auctionId, "token", "2");
    assert.fieldEquals("Auction", auctionId, "startDate", "11111111111");
    assert.fieldEquals(
      "Auction",
      auctionId,
      "startPrice",
      "500000000000000000"
    );
  });
});
