# Hardhat-graph Demo

A repository demonstrating how the [hardhat-graph](https://github.com/graphprotocol/hardhat-graph) plugin can be used to allow devs to simultaniously develop and test their contracts and subgraphs, and how to index their contract by running local grah node against a local hardhat node.

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
  
*NOTE: You can check the `deploy` task in the [hardhat.config.ts](https://github.com/dimitrovmaksim/hardhat-graph-demo/blob/main/hardhat.config.ts#L11) file. After compiling and deploying the contract to the local hardhat node, it will execute the built-in `graph` task from the hardhat-graph plugin. In this case it will update the abi's in the subgraph folder(nft-auction-sungraph), it will update the networks.json file with the addresses of the deployed contracts. You'll get a warning informing you that there are differences between the events in your contract's ABI and the subgraph.yaml (In this case we don't want to index all the events so we can ignore the warning) If you make any changes to the sungraph.yaml or schema.graph files, you will have to run the `codegen` command in order to update the generated files. You can check more info about what each  `hardhat-graph` command does here: https://github.com/graphprotocol/hardhat-graph#tasks*
 
5. Build the subgraph by executing `yarn build --network localhost` or `npm run build --network localhost`. 

*NOTE: The `--network` option will tell the `build` command to get the latest configurations (address and startBlock) for the `localhost` network from the `networks.json` config file and update the `subgraph.yaml` file. (Soon this step will be redundant, because the network option will be directly added to the deploy command)*

6. Create a subgraph on the local hardhat node by running `yarn create-local` or `npm run create-local`
7. Deploy the subgraph on the local hardhat node by running `yarn deploy-local` or `npm run deploy-local`
8. Now you can interact with the contract by running the scripts in the `scripts` directory with `npx hardhat run <script>`:
  - `scripts/start-auction.ts` - will mint and open an auction for a DemoNFT with ID 1
  - `scripts/start-auction-minted.ts` - will mint and transfer a DemoNFT with ID 2 to a "person", then that "person" will open and Auction
  - `scripts/demo1_bids.ts` - will create several bids for the DemoNFT with ID 1
  - `scripts/demo2_bids.ts` - will create several bids for the DemoNFT with ID 2
9. You can query the subgraph by opening the following url in your browser `http://127.0.0.1:8000/subgraphs/name/nft-auction/graphql`
