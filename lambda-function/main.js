import axios from "axios";
import { ethers } from "ethers";
import { abi, address } from "./contract/index.js";
import { createTokenIdObject, getCurrentTokenPrice } from "./helpers.js";
import { getPastBalances } from "./queries.js";

async function getBalance(transactionHash) {
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

async function listen() {
  console.log("Starting...");

  let tokens_to_hasura;

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

  const insertedValues = new Set();

  contract.on("*", async (event) => {
    const transaction = await provider.waitForTransaction(
      event.transactionHash
    );

    // can move getBalances into getCurrentToken price and pass getBalances the transaction hash

    const balances = await getBalance(transaction.transactionHash);

   
    balances.length > 0
      ? (tokens_to_hasura = await getCurrentTokenPrice(balances))
      : console.log("No balances found/Txn not a token transfer");

    await tokens_to_hasura;

    if (insertedValues.has(tokens_to_hasura.txnID)) {
      return;
    }

    // given all events are being listened for, checking to make sure the txnID has not already been inserted
    insertedValues.add(tokens_to_hasura.txnID);


    const query = `
    mutation insertTokenInfo($tokens_to_hasura: [treasury_token_history_insert_input!]!) {
      insert_treasury_token_history(objects: $tokens_to_hasura) {
        affected_rows
      }
    }
    `;

    const headers = {
      "Content-Type": "application/json",
      "x-hasura-admin-secret": process.env.HASURA_SECRET_KEY,
    };

    const response = await axios.post("http://localhost:8080/v1/graphql", {
      query,
      variables: {
        tokens_to_hasura,
      },
    });

    // const response = await axios.post(process.env.HASURA_URL, {
    //   query,
    //   variables: {
    //     tokens_to_hasura,
    //   },
    // }, { headers });

    console.log("Mutation result", response.data);
  });
}

await listen();
