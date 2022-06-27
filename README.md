# Hardhat-graph Demo

A repository demonstrating how the hardhat-graph plugin can be used to allow devs to simultaniously develop and test their contracts and subgraphs, and how to index their contract by running local grah node against a local hardhat node.

# Prequisites:
1. Run `yarn` or `npm install` to install the dependencies
2. Run `yarn codegen` or `npm run codegen`

# Run matchstick test:
1. Just run `yarn graph-test` or `npm run graph-test`

# Run hardhat tests:
1. Just run `npx hardhat test`

# How to index the contract on localhost network:
1. You will need 3 terminal windows/tabs open
2. In one of the windows/tabs run `yarn hardhat-local` or `npm run hardhat-local`
3. In another window/tab run `yarn graph-local` or `npm run graph-local`
4. Deploy the contracts:
  - `npx hardhat deploy --contract-name DemoNFT`
  - `npx hardhat deploy --contract-name NFTAuction`
5. Build the subgraph by executing `yarn build --network localhost` or `npm run build --network localhost`
6. Create a subgraph on the local hardhat node by running `yarn create-local` or `npm run create-local`
7. Deploy the subgraph on the local hardhat node by running `yarn deploy-local` or `npm run deploy-local`
8. Now you can interact with the contract by running the scripts in the `scripts` directory with `npx hardhat run <script>`:
  - `scripts/start-auction.ts` - will mint and open an auction for an nft with ID 1
  - `scripts/start-auction-minted.ts` - will mint and transfer an nft to a "person", then that person will open and Auction
  - `scripts/demo1_bids` - will create several bids for the NFT with ID 1
  - `scripts/demo2_bids` - will create several bids for the NFT with ID 2
9. You can query the subgraph by opening the following url in your browser `http://127.0.0.1:8000/subgraphs/name/nft-auction/graphql`
