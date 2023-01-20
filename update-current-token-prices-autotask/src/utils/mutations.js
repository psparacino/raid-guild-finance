const axios = require("axios");

async function insertCurrentPrice(
  current_token_price,
  HASURA_SECRET_KEY,
  HASURA_URL
) {
  const query = `
    mutation insertTokenInfo($current_token_price: [current_token_prices_insert_input!]!) {
      insert_current_token_prices(objects: $current_token_price) {
        affected_rows
      }
    }
    `;

  const headers = {
    "Content-Type": "application/json",
    "x-hasura-admin-secret": HASURA_SECRET_KEY,
  };

  const response = await axios.post(
    HASURA_URL,
    {
      query,
      variables: {
        current_token_price,
      },
    },
    { headers }
  );

  console.log("Mutation result", response.data);

  return response;
}

module.exports = { insertCurrentPrice };
