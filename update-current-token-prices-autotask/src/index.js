const { insertCurrentPrice } = require("./utils/mutations.js");
const { getTokenIDs, clearTable } = require("./utils/queries.js");
const axios = require("axios");

exports.handler = async function (event) {
  console.log("Starting...");
  const { HASURA_URL, HASURA_SECRET_KEY } = event.secrets;

  const ids_set = await getTokenIDs(HASURA_URL, HASURA_SECRET_KEY);

  const deleteResult = clearTable(HASURA_URL, HASURA_SECRET_KEY);

  console.log(await deleteResult);

  for (let i = 0; i < ids_set.length; i++) {
    const id = await ids_set[i];

    await new Promise((resolve) => setTimeout(resolve, 2000));

    try {
      const res = await axios.get(
        `https://api.coingecko.com/api/v3/coins/${id}`
      );

      const price_usd = res.data.market_data.current_price.usd;

      const symbol = res.data.symbol;

      const current_token_price = { token_name: id, price_usd, symbol };

      console.log(current_token_price, "current_token_price")

      const result = await insertCurrentPrice(
        current_token_price,
        HASURA_SECRET_KEY,
        HASURA_URL
      );

      console.log("Response result: ", id, result.status);
    } catch (error) {
      console.error("coingecko api error or hasura error", error);
    }
  }

  return "Log Successful";
};
