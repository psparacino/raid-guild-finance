const COINS = require("../data/coins.js");
const axios = require("axios");

// date needs to be in this format for coingecko and then reversed for hasura
function unixToDate(timestamp) {
  var date = new Date(timestamp * 1000);
  var day = date.getDate();
  var month = date.getMonth() + 1;
  var year = date.getFullYear();

  return `${year}-${month}-${day}`;
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

async function createTokenIdObject(balances) {

  const coins = COINS;
  const balanceObjects = [];
  
  for (let i = 0; i < balances.length; i++) {
    const balance = balances[i];

    const txnID = balance.id;
    const transactionHash = balance.transactionHash;

    const symbol =
      balance.tokenSymbol === "UNI-V2"
        ? "uni"
        : balance.tokenSymbol.toLowerCase();
    const date = unixToDate(balance.timestamp);

    const match = Object.entries(coins).find(([key, coin]) => {
      return coin.symbol === symbol && coin.symbol !== "wxdai";
    });

    if (match == undefined) {
      return null;
    } else {
      const id = getCorrectId(match[1].id);
      balanceObjects.push(
        Object.assign({}, { date }, { id }, { txnID }, { transactionHash })
      );
    }
  }
  return balanceObjects;
}

async function getCurrentTokenPrice(balances) {
  let values = [];

  const promises = balances.map(async (balance) => {
    const { id, date, txnID } = balance;
    // space out calls to minimize chance of rate limiting
    await new Promise((resolve) => setTimeout(resolve, 2000));

    try {
      const res = await axios.get(
        `https://api.coingecko.com/api/v3/coins/${id}`
      );
      const info = res.data;
      const price = await info.market_data.current_price.usd;
      const symbol = await info.symbol;

      const tokenData = {
        token_name: id,
        date,
        price_usd: price,
        txnID,
        symbol,
      };

      values.push(tokenData);
    } catch (error) {
      console.error("coingecko api error", id, date, error);
    }
  });

  await Promise.all(promises);

  return values;
}

module.exports = { createTokenIdObject, getCurrentTokenPrice };
