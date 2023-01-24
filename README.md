
## Recording Token Value History:

 - **Retrieving all historical token values**:
	 - All historical token values on their date of transaction be be
	   obtained by running getHistory.js
	 - `node getHistory.y.js`
	 - All values will be written to `historicalvalues.js`
	 - To avoid overloading the (free) api, the request are spaced to once
	   every 8 seconds, so be patient!
	 - Add values to Hasura with `insertHistory.js`

**Autotasks**:
 1.  ***Treasury*** 
 - A sentinel running on Open Zeppelin's Defender platform is running which monitors the Raid Guild Moloch Contract for all events.
  - Any event triggers an autotask, which evaluates whether the transaction corresponded to a token transaction on the contract.
  - If a token transfer has taken place, the autotask retrieves the current price from the coingecko api, and logs the date, current price, and symbol on the `treasury_tokens_history` in the Dungeon Master Hasura.

 2. ***Token Contracts*** 
 - A sentinel running on Open Zeppelin's Defender platform monitors the token contracts of all the non-stablecoins in the treasury.
  - If the treasury is the recipient of a Trasnfer event, all the above data is logged in the `treasury_tokens_history` table in the Dungeon Master Hasura.
  
 3. ***Current Token Prices*** 
 - To prevent overloading the free tier coingecko with calls from the frontend, every hour this CRON job runs which logs the current market price of all non-stablecoins into the `current_token_prices` table.

