import fetch from 'node-fetch';
import fs from 'fs';

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

  async function getCoins() {
    try {
        const COINS = await fetch('https://api.coingecko.com/api/v3/coins/list');
        const coins = await COINS.json();
      return coins;
    } catch (error) {
      console.error(error);
    }
  }


function unixTimestampToDate(timestamp) {
    
    var date = new Date(timestamp * 1000);
  
    // Get the day, month, and year
    var day = date.getDate();
    var month = date.getMonth() + 1; // Months are zero based
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
    const coins = await getCoins();
    const balances = await getBalances();
    const balanceObjects = [];
    balances.map(balance => {
        let id;
        let match;
    
        const symbol = balance.tokenSymbol === "UNI-V2" ? "uni" : (balance.tokenSymbol).toLowerCase();
        const date = unixTimestampToDate(balance.timestamp);
    
        match = Object.entries(coins).find(([key, coin]) => {
            return coin.symbol === symbol && coin.symbol !== 'wxdai';
    
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
