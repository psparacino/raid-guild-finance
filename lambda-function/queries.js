// import { createTokenIdObject } from "./helpers.js";
// import { address } from "./contract/index.js";
// import axios from "axios";

// convert above to require
const createTokenIdObject = require("./helpers.js");
const address = require("./contract/index.js");
const axios = require("axios");

export async function getBalance(transactionHash) {
  const query = `
  query balances($address: String!, $transactionHash: String!) {
    balances(
      where: {balance_gt: "0", tokenSymbol_not: "WXDAI", molochAddress: $address, transactionHash: $transactionHash}
    ) {
      id
      transactionHash
      timestamp
      balance
      tokenSymbol
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

export async function getPastBalances() {
  const query = `
      query moloch($address: String!) {
        balances(where: {molochAddress: $address}, orderBy: timestamp, first: 10, orderDirection: asc) {
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
