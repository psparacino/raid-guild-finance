const { getCurrentTokenPrice } = require("./utils/helpers.js");
const { getBalances } = require("./utils/queries.js");
const { insertTokenValue } = require("./utils/mutations.js");
const { address } = require("./contract/address.js");

exports.handler = async function (event) {
  console.log("Starting...");

  const { HASURA_URL, HASURA_SECRET_KEY } = event.secrets;

  const transactionHash = event.request.body.hash;

  console.log("transaction hash: ", transactionHash);

  const insertedValues = new Set();
  let tokens_to_hasura;

  if (transactionHash === undefined) {
    console.log("no hash found");
    return;
  }

  const balances = await getBalances(transactionHash);

  console.log("BALANCES: ", balances);

  if (balances && balances.length > 0) {
    tokens_to_hasura = await getCurrentTokenPrice(balances);
  } else {
    console.log(
      "No balances found: txn not a token transfer or txn is a wxdai txn"
    );
    return;
  }

  if (insertedValues.has(tokens_to_hasura.txnID)) {
    console.log("This txnID has already been inserted");
    return;
  }

  insertedValues.add(tokens_to_hasura.txnID);

  const response = await insertTokenValue(
    tokens_to_hasura,
    HASURA_SECRET_KEY,
    HASURA_URL
  );

  console.log("Mutation result: ", response.data);


  return "Log Successful";
};
