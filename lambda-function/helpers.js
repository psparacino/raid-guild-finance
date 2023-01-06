import COINS from "./data/coins.js";
import fetch from "node-fetch";

// date needs to be in this format for coingecko and then reversed for hasura
function unixToDateCoinGeckoFormat(timestamp) {
  var date = new Date(timestamp * 1000);
  var day = date.getDate();
  var month = date.getMonth() + 1;
  var year = date.getFullYear();

  return `${year}-${month}-${day}`;
}

function unixToDateHasuraFormat(values) {
  return values.map((item) => {
    const date = item.date.split("-").reverse().join("-");
    const token_name = item.token_name;
    const price_usd = item.price_usd;
    const txnID = item.txnID;
    return { token_name, date, price_usd, txnID };
  });
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

// export async function createTokenIdObject(balances) {
// alert below is for testing
export async function createTokenIdObject() {
  const coins = COINS;
  const balanceObjects = [];
  const balances = [
    {
      id: "0xfe1084bc16427e5eb7f13fc19bcd4e641f7d571f-14615497-0x6a023ccd1ff6f2045c3309768ead9e68f978f6e1",
      molochAddress: "0xfe1084bc16427e5eb7f13fc19bcd4e641f7d571f",
      transactionHash:
        "0xb2869c9be268a6a176cdab887b8576a3e1c2b46fd3eb3169abca7bc7ed53879c",
      timestamp: "1613690540",
      balance: "1000000000000000",
      tokenSymbol: "WETH",
      tokenAddress: "0x6a023ccd1ff6f2045c3309768ead9e68f978f6e1",
      amount: "1000000000000000",
    },
  ];
  balances.map((balance) => {
    let id;
    let match;
    const txnID = balance.id;
    console.log(txnID);
    const symbol =
      balance.tokenSymbol === "UNI-V2"
        ? "uni"
        : balance.tokenSymbol.toLowerCase();
    const date = unixToDateCoinGeckoFormat(balance.timestamp);

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

export async function getCurrentTokenPrice(balances) {
  let values = [];

  const promises = balances.map(async (balance) => {
    const { id, date } = balance;

    try {
      const res = await fetch(`https://api.coingecko.com/api/v3/coins/${id}`);
      const tokenInfo = await res.json();
      const price = await tokenInfo.market_data.current_price.usd;

      const tokenData = { token_name: id, date, price_usd: price };

      values.push(tokenData);
    } catch (error) {
      console.error(id, date, error);
    }
  });

  await Promise.all(promises);
  const result = await unixToDateHasuraFormat(values);

  return result;
}
