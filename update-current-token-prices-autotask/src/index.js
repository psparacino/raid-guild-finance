const { insertCurrentPrice } = require("./utils/mutations.js");
const { getTokenSymbols } = require("./utils/queries.js");
const axios = require("axios");

exports.handler = async function (event) {
  console.log("Starting...");
  const { HASURA_URL, HASURA_SECRET_KEY } = event.secrets;

  const symbols_set = await getTokenSymbols(HASURA_URL, HASURA_SECRET_KEY);
  console.log("symbols_set", symbols_set);

  for (let i = 0; i < symbols_set.length; i++) {
    const id = await symbols_set[i];

    await new Promise((resolve) => setTimeout(resolve, 2000));

    try {
      const res = await axios.get(
        `https://api.coingecko.com/api/v3/coins/${id}`
      );

      const price_usd = res.data.market_data.current_price.usd;

      const current_token_price = { symbol: id, price_usd };

      const result = await insertCurrentPrice(
        current_token_price,
        HASURA_SECRET_KEY,
        HASURA_URL
      );

      console.log("Response result: ", result.status);
    } catch (error) {
      console.error("coingecko api error or hasura error", error);
    }
  }

  return "Log Successful";
};
