const axios = require("axios");
require("dotenv").config({ path: "../../../.env" });

async function clearTable(HASURA_URL, HASURA_SECRET_KEY) {
  const query = `
  mutation {
    delete_current_token_prices(where: {}) {
      affected_rows
    }
  }
    `;

  const headers = {
    "Content-Type": "application/json",
    "x-hasura-admin-secret": HASURA_SECRET_KEY,
  };

  try {
    const response = await axios.post(HASURA_URL, { query }, { headers });

    const deleteResponse = response.data.data;

    return deleteResponse;
  } catch (error) {
    console.error(error);
  }
}

async function getTokenIDs(HASURA_URL, HASURA_SECRET_KEY) {
  const query = `
    query getTokenIDs {
      treasury_token_history {
        token_name
      }
    }
  
    `;

  const headers = {
    "Content-Type": "application/json",
    "x-hasura-admin-secret": HASURA_SECRET_KEY,
  };

  try {
    const response = await axios.post(HASURA_URL, { query }, { headers });

    const balanceArray = response.data.data.treasury_token_history;
    let all_ids_set = Array.from(
      new Set(balanceArray.map((tokenObj) => tokenObj.token_name))
    );
    let stablecoins_and_no_listing = ["wxdai", "usdc", "ethys"];
    let idsSet = all_ids_set.filter(
      (id) => !stablecoins_and_no_listing.includes(id)
    );

    return idsSet;
  } catch (error) {
    console.error(error);
  }
}

module.exports = { getTokenIDs, clearTable };
