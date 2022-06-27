import { assert, beforeAll, describe, test, newMockEvent } from "matchstick-as";
import { Address, BigInt, ethereum } from "@graphprotocol/graph-ts";
// import { Auction } from "../generated/schema";
import { AuctionStarted, Withdraw } from "../generated/NFTAuction/NFTAuction";
import { handleAuctionStarted, handleWithdraw } from "../src/nft-auction";

describe("AuctionStarted event", () => {
  beforeAll(() => {
    const event = changetype<AuctionStarted>(newMockEvent());
    event.address = Address.fromString(
      "0x5FbDB2315678afecb367f032d93F642f64180aa3"
    );
    event.parameters = [];
    event.parameters.push(
      new ethereum.EventParam(
        "id",
        ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(1))
      )
    );
    event.parameters.push(
      new ethereum.EventParam(
        "creator",
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
      new ethereum.EventParam(
        "startPrice",
        ethereum.Value.fromUnsignedBigInt(BigInt.fromI64(500000000000000000))
      )
    );

    handleAuctionStarted(event);
  });

  test("AuctionStarted event should create a new auction", () => {
    assert.entityCount("Auction", 1);
  });

  test("Auction should have the correct values", () => {
    assert.fieldEquals(
      "Auction",
      "1",
      "creator",
      "0x0000000000000000000000000000000000000001"
    );
    assert.fieldEquals("Auction", "1", "token", "2");
    assert.fieldEquals("Auction", "1", "startDate", "11111111111");
    assert.fieldEquals("Auction", "1", "startPrice", "500000000000000000");
  });
});

describe("Withdraw event", () => {
  beforeAll(() => {
    const event = changetype<Withdraw>(newMockEvent());
    event.address = Address.fromString(
      "0x5FbDB2315678afecb367f032d93F642f64180aa3"
    );
    event.parameters = [];
    event.parameters.push(
      new ethereum.EventParam("tokenId", ethereum.Value.fromI32(2))
    );
    event.parameters.push(
      new ethereum.EventParam(
        "to",
        ethereum.Value.fromAddress(
          Address.fromString("0x0000000000000000000000000000000000000001")
        )
      )
    );
    event.parameters.push(
      new ethereum.EventParam(
        "amount",
        ethereum.Value.fromUnsignedBigInt(
          BigInt.fromString("500000000000000000")
        )
      )
    );
    event.parameters.push(
      new ethereum.EventParam("success", ethereum.Value.fromBoolean(true))
    );

    handleWithdraw(event);
  });

  test("Withdraw should have the correct values", () => {
    const withdrawId = "0x0000000000000000000000000000000000000001-2-500000000000000000";

    assert.fieldEquals("Withdraw", withdrawId, "token", "2");
    assert.fieldEquals(
      "Withdraw",
      withdrawId,
      "to",
      "0x0000000000000000000000000000000000000001"
    );
    assert.fieldEquals("Withdraw", withdrawId, "amount", "500000000000000000");
    assert.fieldEquals("Withdraw", withdrawId, "success", "true");
  });
});
