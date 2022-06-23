import { Transfer as TransferEvent } from "../generated/DemoNFT/DemoNFT";
import { Transfer, Demo } from "../generated/schema";

export function handleTransfer(event: TransferEvent): void {
  const id = event.params.tokenId.toString();
  let demo = Demo.load(id);

  if (!demo) {
    demo = new Demo(id);
    demo.imageUrl = `https://example.com/images/${id}.jpg`;
  }
  demo.owner = event.params.to;
  demo.save();

  const demoTransfer = new Transfer(event.transaction.hash.toHexString());
  demoTransfer.from = event.params.from;
  demoTransfer.to = event.params.to;
  demoTransfer.token = id;
  demoTransfer.save();
}
