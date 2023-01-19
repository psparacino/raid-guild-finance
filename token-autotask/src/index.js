const { abi, address } = require("./contract/index.js");
const ethers = require("ethers");
const { unixToDate, getCorrectId } = require("./utils/helpers.js");
const { insertTokenValue } = require("./utils/mutations.js");
const axios = require("axios");

exports.handler = async function (event) {
  console.log("Starting...");
  const { HASURA_URL, HASURA_SECRET_KEY } = event.secrets;

  const transferEvent =
    "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef";

  const molochAddress = address.MolochAddress;
  const logs = event.request.body.transaction.logs;
  const tokenAddress = logs[0].address;

  for (let i = 0; i < logs.length; i++) {
    const log = logs[i];
    const transactionHash = event.request.body.hash;

    const name = log.topics[0];

    const encodedRecipient = log.topics[2];

    if (encodedRecipient === undefined) {
      console.log("No recipient in topics");
      continue;
    }

    let recipient = ethers.utils.defaultAbiCoder.decode(
      ["address"],
      encodedRecipient
    );

    console.log("Recipient : ", recipient);

    if (name !== transferEvent) {
      console.log("Not a transfer event");
    }

    if (recipient === molochAddress) {
      try {
        const res = await axios.get(
          `https://api.coingecko.com/api/v3/coins/xdai/contract/${tokenAddress}`
        );
        const info = res.data;
        const price_usd = await info.market_data.current_price.usd;
        const symbol = await info.symbol;
        const token_name = await getCorrectId(info.id);
        const txnID = ethers.utils.keccak256(transactionHash, log.logIndex);
        const date = unixToDate();

        const tokenData = { token_name, date, price_usd, txnID, symbol };

        const result = await insertTokenValue(
          tokenData,
          HASURA_SECRET_KEY,
          HASURA_URL
        );

        console.log("Response result: ", result.status);
      } catch (error) {
        console.error("coingecko api error or hasura error", error);
      }
    } else {
      console.log("Treasury not recipient of token transaction");
    }
  }

  return "Log Successful";
};
