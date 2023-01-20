const axios = require("axios");
require("dotenv").config({ path: "../../../.env" });

async function getTokenSymbols(HASURA_URL, HASURA_SECRET_KEY) {

  const query = `
    query getTokenSymbols {
      treasury_token_history {
        symbol
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
    let all_symbols_set = Array.from(
      new Set(balanceArray.map((tokenObj) => tokenObj.symbol))
    );
    let stablecoins = ["wxdai", "usdc"];
    let symbolsSet = all_symbols_set.filter(
      (symbol) => !stablecoins.includes(symbol)
    );

    return symbolsSet;
  } catch (error) {
    console.error(error);
  }
}

module.exports = { getTokenSymbols };
