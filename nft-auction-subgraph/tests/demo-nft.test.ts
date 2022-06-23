import {
  assert,
  beforeAll,
  clearStore,
  describe,
  test,
  newMockEvent,
  afterAll,
} from "matchstick-as";
import { Address, BigInt, ethereum } from "@graphprotocol/graph-ts";
import { Demo } from "../generated/schema";
import { Transfer as TransferEvent } from "../generated/DemoNFT/DemoNFT";
import { handleTransfer } from "../src/demo-nft";

// beforeAll(() => {
//   const tokenId = ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(123));

//   createMockedFunction(
//     Address.fromString("0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"),
//     "tokenURI",
//     "tokenURI(uint256):(string)"
//   )
//     .withArgs([tokenId])
//     .returns([ethereum.Value.fromString("demoipfshash")]);

//   mockIpfsFile("demoipfshash", "./nft-auction-subgraph/tests/.ipfs/demo-nft.json");
// });

afterAll(() => {
  clearStore();
});

describe("DemoNFT Transfer event", () => {
  beforeAll(() => {
    const transferEvent = changetype<TransferEvent>(newMockEvent());
    transferEvent.address = Address.fromString(
      "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"
    );
    transferEvent.parameters = [];
    transferEvent.parameters.push(
      new ethereum.EventParam(
        "from",
        ethereum.Value.fromAddress(
          Address.fromString("0x0000000000000000000000000000000000000001")
        )
      )
    );

    transferEvent.parameters.push(
      new ethereum.EventParam(
        "to",
        ethereum.Value.fromAddress(
          Address.fromString("0x0000000000000000000000000000000000000002")
        )
      )
    );

    transferEvent.parameters.push(
      new ethereum.EventParam(
        "tokenId",
        ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(123))
      )
    );

    handleTransfer(transferEvent);
  });

  test("Should create a new DemoNFT and TransferDemo", () => {
    assert.entityCount("Demo", 1);
    assert.entityCount("DemoTransfer", 1);
  });

  test("DemoNFT should have correct fields", () => {
    assert.fieldEquals(
      "Demo",
      "123",
      "owner",
      "0x0000000000000000000000000000000000000002"
    );

    assert.fieldEquals(
      "Demo",
      "123",
      "imageUrl",
      "https://example.com/images/123.jpg"
    );
  });

  test("DemoNFT should have DemoTransfers", () => {
    const demo = Demo.load("123")!;
    assert.i32Equals(demo.transfers.length, 1);
  });

  test("DemoTransfer should have correct fields", () => {
    const demo = Demo.load("123")!;
    const transferId = demo.transfers[0];

    assert.fieldEquals(
      "DemoTransfer",
      transferId,
      "from",
      "0x0000000000000000000000000000000000000001"
    );

    assert.fieldEquals(
      "DemoTransfer",
      transferId,
      "to",
      "0x0000000000000000000000000000000000000002"
    );
    assert.fieldEquals("DemoTransfer", transferId, "token", "123");
  });
});
