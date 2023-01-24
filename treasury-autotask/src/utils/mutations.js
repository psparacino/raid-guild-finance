const axios = require("axios");

async function insertTokenValue(
  tokens_to_hasura,
  HASURA_SECRET_KEY,
  HASURA_URL
) {
  const query = `
    mutation insertTokenInfo($tokens_to_hasura: [treasury_token_history_insert_input!]!) {
      insert_treasury_token_history(objects: $tokens_to_hasura) {
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
        tokens_to_hasura,
      },
    },
    { headers }
  );

  console.log("Mutation result", response.data);

  return response;
}

module.exports = { insertTokenValue };
