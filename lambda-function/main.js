// const axios = require("axios");
// const ethers = require("ethers");
// const { abi, address } = require("./contract");
// const { unixToDateTime, getCorrectId } = require("./helpers");

// convert above to import statements
import axios from "axios";
import { ethers } from "ethers";
import { abi, address } from "./contract/index.js";
import { createTokenIdObject, getCurrentTokenPrice } from "./helpers.js";
// import { getPastBalances } from "./queries.js";

async function getBalance(transactionHash) {
  const query = `
    query moloch($address: String!, $transactionHash: String!) {
      balances(where: {molochAddress: $address, transactionHash: $transactionHash}, orderBy: timestamp, orderDirection: asc) {
        id
        molochAddress
        transactionHash
        timestamp
        balance
        tokenSymbol
        tokenAddress
        amount
      }
    }
    `;

  const url =
    "https://api.thegraph.com/subgraphs/name/odyssy-automaton/daohaus-stats-xdai";

  const variables = {
    address: address.MolochAddress,
    transactionHash: transactionHash,
  };

  try {
    const response = await axios.post(url, { query, variables });
    const balanceArray = response.data.data.balances;
    const balances = await createTokenIdObject(balanceArray);
    return balances;
  } catch (error) {
    console.error(error);
  }
}

async function listen() {
  console.log("Starting...");

  const MolochABI = abi.MolochABI;
  const MolochAddress = address.MolochAddress;

  // see what events the daohaus subgraph listens for to register token transfers
  const erc20ABI = abi.erc20ABI;
  const wxdai = "0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d";

  const provider = new ethers.providers.JsonRpcProvider(
    "https://rpc.gnosischain.com/"
  );

  let wallet = ethers.Wallet.createRandom();

  const contract = new ethers.Contract(
    wxdai,
    erc20ABI,
    provider.getSigner(wallet.address)
  );

  contract.on("*", async (event) => {
    const transaction = await provider.waitForTransaction(
      event.transactionHash
    );

    // can move getBalances into getCurrentToken price and pass getBalances the transaction hash
    const balances = await getBalance(transaction.transactionHash);
    const token = await getCurrentTokenPrice(balances);
    console.log("TOKEN", token);
  });
}

await listen();
