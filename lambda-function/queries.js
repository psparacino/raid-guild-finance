import { createTokenIdObject } from "./helpers.js";
import { address } from "./contract/index.js";
import axios from "axios";

async function getPastBalances() {
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
    console.log(balanceArray);
    const balances = await createTokenIdObject(balanceArray);
    return balances;
  } catch (error) {
    console.error(error);
  }
}

const result = await getPastBalances();
console.log("Past balances: ", result);
