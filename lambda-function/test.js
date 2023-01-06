import fetch from "node-fetch";

const balances = [{ date: "2021-2-18", id: "weth" }];

function unixToDateHasuraFormat(values) {
  return values.map((item) => {
    const date = item.date.split("-").reverse().join("-");
    const token_name = item.token_name;
    const price_usd = item.price_usd;
    return { token_name, date, price_usd };
  });
}

async function getCurrentTokenPrice(balances) {
  let values = [];

  const promises = balances.map(async (balance) => {
    const { id, date } = balance;
    console.log(`id: ${id}`);
    console.log(`date: ${date}`);

    try {
      const res = await fetch(`https://api.coingecko.com/api/v3/coins/${id}`);
      const tokenInfo = await res.json();
      const price = await tokenInfo.market_data.current_price.usd;
      const tokenData = { token_name: id, date, price_usd: price };
      console.log("tokenData", tokenData);
      values.push(tokenData);
    } catch (error) {
      console.error(id, date, error);
    }
  });
  await Promise.all(promises);

  const result = await unixToDateHasuraFormat(values);
  return result;
}

getCurrentTokenPrice(balances);
