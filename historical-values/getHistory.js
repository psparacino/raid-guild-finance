import fetch from "node-fetch";
import fs from "fs";

import COINS from "./coins/coins.js";

const query = `
query moloch($address: String!) {
    balances(where: {molochAddress: $address}, first: 1000, skip: $skip, orderBy: timestamp, orderDirection: asc) {
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

const variables = {
  address: "0xfe1084bc16427e5eb7f13fc19bcd4e641f7d571f",
};

const url =
  "https://api.thegraph.com/subgraphs/name/odyssy-automaton/daohaus-stats-xdai";

const opts = {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ query, variables }),
};

async function getBalances() {
  try {
    const res = await fetch(url, opts);
    const json = await res.json();
    const balances = json.data.balances;
    return balances;
  } catch (error) {
    console.error(error);
  }
}

function unixTimestampToDate(timestamp) {
  var date = new Date(timestamp * 1000);
  var day = date.getDate();
  var month = date.getMonth() + 1;
  var year = date.getFullYear();

  return `${day}-${month}-${year}`;
}

function getCorrectId(tokenId) {
  const id = tokenId.toLowerCase();
  switch (id) {
    case "xdai-stake":
      return "ethereum-stake";
    case "ancient-raid":
      return "raid-token";
    case "gtc":
      return "gitcoin";
    case "unicorn-token":
      return "uniswap";
    default:
      return id;
  }
}

async function createTokenIdObject() {
  const coins = COINS;
  const balances = await getBalances();
  const balanceObjects = [];
  balances.map((balance) => {
    let id;
    let match;
    let txnID = balance.id;

    const symbol =
      balance.tokenSymbol === "UNI-V2"
        ? "uni"
        : balance.tokenSymbol.toLowerCase();
    const date = unixTimestampToDate(balance.timestamp);

    match = Object.entries(coins).find(([key, coin]) => {
      return coin.symbol === symbol && coin.symbol !== "wxdai";
    });

    if (match == undefined) {
      return null;
    } else {
      id = getCorrectId(match[1].id);

      balanceObjects.push(Object.assign({}, { date }, { id }, { txnID }));
    }
  });
  return balanceObjects;
}

async function getHistoricalTokenValues() {
  const balances = await createTokenIdObject();
  let historicalValues = [];

  // Split the list of balances into smaller chunks
  const chunkSize = 19;
  for (let i = 0; i < balances.length; i += chunkSize) {
    const slice = balances.slice(i, i + chunkSize);

    for (const balance of slice) {
      const id = balance.id;
      const date = balance.date;
      const txnID = balance.txnID;

      await new Promise((resolve) => setTimeout(resolve, 8000));

      try {
        const res = await fetch(
          `https://api.coingecko.com/api/v3/coins/${id}/history?date=${date}`
        );
        console.log("response", res);
        const prices = await res.json();
        const price = await prices.market_data.current_price.usd;
        const symbol = await prices.symbol;
        const tokenData = {
          token_name: id,
          date,
          price_usd: price,
          txnID,
          symbol,
        };
        historicalValues.push(tokenData);
      } catch (error) {
        console.error(balance.id, balance.date, error);
      }
    }
  }
  const format = (arr) => {
    return arr.map((item) => {
      const date = item.date.split("-").reverse().join("-");
      const token_name = item.token_name;
      const price_usd = item.price_usd;
      const txnID = item.txnID;
      const symbol = item.symbol;
      return { token_name, date, price_usd, txnID, symbol };
    });
  };

  const result = await format(historicalValues);
  console.log("historicalValues.length", historicalValues.length);
  fs.writeFileSync("historicalvalues-with-txnID.js", JSON.stringify(result));
}

await getHistoricalTokenValues();
