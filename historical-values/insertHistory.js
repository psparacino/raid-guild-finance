import axios from "axios";
import token_history from "./historicalvalues.js";
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

async function insertTokenValue() {
  const query = `
    mutation insertTokenInfo($token_history: [treasury_token_history_insert_input!]!) {
      insert_treasury_token_history(objects: $token_history) {
        affected_rows
      }
    }
    `;

  const { TEST_HASURA_SECRET_KEY, TEST_HASURA_URL } = process.env;

  const headers = {
    "Content-Type": "application/json",
    "x-hasura-admin-secret": TEST_HASURA_SECRET_KEY,
  };

  const response = await axios.post(
    TEST_HASURA_URL,
    {
      query,
      variables: {
        token_history,
      },
    },
    { headers }
  );

  console.log("History Mutation Result", response.data);

  return response;
}

insertTokenValue();
