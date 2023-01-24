const { createTokenIdObject } = require("./helpers.js");
const address = require("../contract/address.js");
const axios = require("axios");

async function getBalances(transactionHash) {
  const query = `
  query molochTxn($id: String!, $transactionHash: String!) {
    moloch(id: $id) {
      balances(where: {transactionHash: $transactionHash, tokenSymbol_not: "WXDAI"}) {
        id
        amount
        balance
        transactionHash
        tokenSymbol
        timestamp
        action
      }
    }
  }
    `;

  const url =
    "https://api.thegraph.com/subgraphs/name/odyssy-automaton/daohaus-stats-xdai";

  const variables = {
    id: address.MolochAddress,
    transactionHash: transactionHash,
  };

  try {
    const response = await axios.post(url, { query, variables });

    const balanceArray = response.data.data.moloch.balances;
    const balances = await createTokenIdObject(balanceArray);

    return balances;
  } catch (error) {
    console.error(error);
  }
}

module.exports = { getBalances };
