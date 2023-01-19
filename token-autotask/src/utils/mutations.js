const axios = require("axios");

async function insertTokenValue(tokenData, HASURA_SECRET_KEY, HASURA_URL) {
  const query = `
    mutation insertTokenInfo($tokenData: [treasury_token_history_insert_input!]!) {
      insert_treasury_token_history(objects: $tokenData) {
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
        tokenData,
      },
    },
    { headers }
  );

  console.log("Mutation result", response.data);

  return response;
}

module.exports = { insertTokenValue };
