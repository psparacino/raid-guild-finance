import fetch from 'node-fetch';
import fs from 'fs';

import COINS from './coins.js';

const query = `
query moloch($address: String!, $skip: Int!) {
    balances(where: {molochAddress: $address}, first: 1000, skip: $skip, orderBy: timestamp, orderDirection: asc) {
      id
      molochAddress
      transactionHash
      timestamp
      balance
      tokenSymbol
      tokenAddress
      amount
    }
  }
`;

const variables = {
  address: "0xfe1084bc16427e5eb7f13fc19bcd4e641f7d571f",
  skip: 0
};

const url = 'https://api.thegraph.com/subgraphs/name/odyssy-automaton/daohaus-stats-xdai';

const opts = {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },  
  body: JSON.stringify({ query, variables })
};

async function getBalances() {
    try {
      const res = await fetch(url, opts)
      const json = await res.json();
      const balances = json.data.balances;
      return balances;
    } catch (error) {
      console.error(error);
    }
  }


function unixTimestampToDate(timestamp) {
    
    var date = new Date(timestamp * 1000);
    var day = date.getDate();
    var month = date.getMonth() + 1; 
    var year = date.getFullYear();
  
    return `${day}-${month}-${year}`;
  }
  

function getCorrectId(tokenId) {
    const id = tokenId.toLowerCase();
    switch (id) {
        case 'xdai-stake':
            return 'ethereum-stake';  
        case 'ancient-raid':
            return 'raid-token';
        case 'gtc':
            return 'gitcoin';
        case 'unicorn-token':
            return 'uniswap';
        default:
            return id;  
        }
    }

async function createTokenIdObject() {
    const coins = COINS;
    const balances = await getBalances();
    const balanceObjects = [];
    balances.map(balance => {
        let id;
        let match;
    
        const symbol = balance.tokenSymbol === "UNI-V2" ? "uni" : (balance.tokenSymbol).toLowerCase();
        const date = unixTimestampToDate(balance.timestamp);
    
        match = Object.entries(coins).find(([key, coin]) => {
            return coin.symbol === symbol && coin.symbol !== 'wxdai';
            // return coin.symbol === symbol;
    
        });
    
        if (match == undefined) {
            return null;
          }
          else {
            id = getCorrectId(match[1].id);
            
            balanceObjects.push(Object.assign({}, { date }, { id }));
          }
        });
      
        return balanceObjects;
  }
   

  async function getHistoricalTokenValues() {
    const balances = await createTokenIdObject();
    let historicalValues = [];
    const slice = balances.slice(0, 20);
  
    for (const balance of slice) {
      const id = balance.id;
      const date = balance.date;
  
      await new Promise(resolve => setTimeout(resolve, 1500));
  
      try {
        const res = await fetch(
          `https://api.coingecko.com/api/v3/coins/${id}/history?date=${date}`
        );
  
        const prices = await res.json();
        const price = await prices.market_data.current_price.usd;
        const tokenData = { id, date, price };
        historicalValues.push(tokenData);  
      } catch (error) {
        console.error(balance.id, balance.date, error);
      }
    }
  
    fs.writeFileSync("historicalvalues.js", JSON.stringify(historicalValues, {space: 0}));
  }




getHistoricalTokenValues();   
