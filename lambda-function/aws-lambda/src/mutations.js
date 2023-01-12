const axios = require("axios");

async function insertTokenValue(tokens_to_hasura) {
  const query = `
    mutation insertTokenInfo($tokens_to_hasura: [treasury_token_history_insert_input!]!) {
      insert_treasury_token_history(objects: $tokens_to_hasura) {
        affected_rows
      }
    }
    `;

  const headers = {
    "Content-Type": "application/json",
    "x-hasura-admin-secret": process.env.HASURA_SECRET_KEY,
  };

  const response = await axios.post("http://localhost:8080/v1/graphql", {
    query,
    variables: {
      tokens_to_hasura,
    },
  });
  console.log("Mutation result", response.data);
  // const response = await axios.post(process.env.HASURA_URL, {
  //   query,
  //   variables: {
  //     tokens_to_hasura,
  //   },
  // }, { headers });
  return response;
}

module.exports = { insertTokenValue };
