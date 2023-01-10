// import axios from "axios";
// import { ethers } from "ethers";
// import { abi, address } from "./contract/index.js";
// import { createTokenIdObject, getCurrentTokenPrice } from "./helpers.js";
// import { getPastBalances, getBalance } from "./queries.js";
// import { insertTokenValue } from "./mutations.js";
// convert above to require
const abi = require("./contract/index.js");
const address = require("./contract/index.js");
const axios = require("axios");
const ethers = require("ethers");
const createTokenIdObject = require("./helpers.js");
const getCurrentTokenPrice = require("./helpers.js");
const getPastBalances = require("./queries.js");
const getBalance = require("./queries.js");
const insertTokenValue = require("./mutations.js");


exports.handler = async function () {
  console.log("Starting...");

  let tokens_to_hasura;

  const MolochABI = abi.MolochABI;
  const MolochAddress = address.MolochAddress;

  // see what events the daohaus subgraph listens for to register token transfers
  const erc20ABI = abi.erc20ABI;
  const wxdai = "0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d";

  const provider = new ethers.providers.JsonRpcProvider(
    "https://rpc.ankr.com/gnosis"
  );

  let wallet = ethers.Wallet.createRandom();

  const contract = new ethers.Contract(
    wxdai,
    erc20ABI,
    provider.getSigner(wallet.address)
  );

  const insertedValues = new Set();

  contract.on("*", async (event) => {
    const transaction = await provider.waitForTransaction(
      event.transactionHash
    );

    const balances = await getBalance(transaction.transactionHash);

    if (balances.length > 0) {
      tokens_to_hasura = await getCurrentTokenPrice(balances);
    } else {
      console.log("No balances found/Txn not a token transfer");
      return;
    }

    if (insertedValues.has(tokens_to_hasura.txnID)) {
      console.log("This txnID has already been inserted");
      return;
    }

    // given all events are being listened for, checking to make sure the txnID has not already been inserted
    insertedValues.add(tokens_to_hasura.txnID);

    const response = await insertTokenValue(tokens_to_hasura);

    console.log("Mutation result", response.data);

    return response.data;
  });
};
