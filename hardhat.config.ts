import * as dotenv from "dotenv";

import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";
import { task } from "hardhat/config";
import "@graphprotocol/hardhat-graph";

task("deploy", "Deploys the passed contract")
  .addParam("contractName", "The name of the contract")
  .setAction(async (taskArgs, hre) => {
    const { contractName } = taskArgs;

    await hre.run("compile");

    const address = await deploy(hre, contractName);

    await hre.run("graph", { contractName, address });
  });

const deploy = async (hre: any, contractName: string): Promise<string> => {
  const contractArtifacts = await hre.ethers.getContractFactory(contractName);
  const contract = await contractArtifacts.deploy();

  await contract.deployed();

  return contract.address;
};

const config = {
  solidity: "0.8.4",
  defaultNetwork: "localhost",
  networks: {
    localhost: {
      url: "http://localhost:8545",
    },
    hardhat: {},
  },
  subgraph: {
    name: "nft-auction",
  },
  paths: {
    subgraph: "nft-auction-subgraph",
  },
};

export default config;
