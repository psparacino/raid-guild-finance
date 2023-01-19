## Recording Token Value History:

- **Retrieving all historical token values**
  - All historical token values on their date of transaction be be obtained by running getHistory.js
  - `node getHistory.y.js`
  - All values will be written to `historicalvalues-with-txnID.js`
  - To avoid overloading the (free) api, the request are spaced to once every 8 seconds, so be patient!
  -
- **Autotask**
  - A sentinel running on Open Zeppelin's Defender platform is running which monitors the Raid Guild Moloch Contract for all events.
  - Any event triggers an autotask, which evaluates whether the transaction corresponded to a token transaction on the contract.
  - If a token transfer has taken place, the autotask retrieves the current price from the coingecko api, and logs the date, current price, and symbol on the `treasury_tokens_history` in the Dungeon Master Hasura.
