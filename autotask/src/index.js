const { getCurrentTokenPrice } = require("./utils/helpers.js");
const { getBalance } = require("./utils/queries.js");
const { insertTokenValue } = require("./utils/mutations.js");


exports.handler = async function (event) {
  console.log("Starting...");

  const { HASURA_URL, HASURA_SECRET_KEY } = event.secrets;

  const events = event.request.body.events;

  const insertedValues = new Set();

  let token_to_hasura;

  for (let i = 0; i < events.length; i++) {
    const transactionHash = events[i].hash;

    const balances = await getBalance(transactionHash);

    if (balances && balances.length > 0) {
      token_to_hasura = await getCurrentTokenPrice(balances);
    } else {
      console.log("No balances found/Txn not a token transfer");
      return;
    }

    if (insertedValues.has(token_to_hasura.txnID)) {
      console.log("This txnID has already been inserted");
      return;
    }

    insertedValues.add(token_to_hasura.txnID);

    const response = await insertTokenValue(
      token_to_hasura,
      HASURA_SECRET_KEY,
      HASURA_URL
    );

    console.log("Mutation result", response.data);
    // return response.data;
  }
  return "Log Successful";
};
