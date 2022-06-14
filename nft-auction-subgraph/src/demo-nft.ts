import { ipfs, json, Bytes } from '@graphprotocol/graph-ts';
import { DemoNFT, Transfer } from "../generated/DemoNFT/DemoNFT";
import { DemoTransfer, Demo } from "../generated/schema";

export function handleTransfer(event: Transfer): void {
  const id = event.params.tokenId.toString();
  let demo = Demo.load(id);
  if (!demo) {
    demo = new Demo(id);
    const contract = DemoNFT.bind(event.address);
    const hash = contract.tokenURI(event.params.tokenId);
    const data = ipfs.cat(hash);

    if (data) {
      const jsonData = json.fromBytes(data as Bytes).toObject();

      const imageUrl = jsonData.get("imageUrl");

      if (imageUrl) {
        demo.imageUrl = imageUrl.toString();
      }
    };

  }
  demo.owner = event.params.to;
  demo.save();

  const demoTransfer = new DemoTransfer(event.transaction.hash.toHexString());
  demoTransfer.from = event.params.from;
  demoTransfer.to = event.params.to;
  demoTransfer.token = demo.id;
  demoTransfer.save();
}
