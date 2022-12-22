import fetch from 'node-fetch';
import fs from 'fs';
import converter from 'convert-array-to-csv';

export const query = `
query moloch($address: String!, $skip: Int!) {
  balances(where: {molochAddress: $address}, first: 1000, skip: $skip, orderBy: timestamp, orderDirection: desc) {
    molochAddress
    transactionHash
  }
}
`;


const variables = {
  address: "0xfe1084bc16427e5eb7f13fc19bcd4e641f7d571f",
  skip: 0
};

export const url = 'https://api.thegraph.com/subgraphs/name/odyssy-automaton/daohaus-stats-xdai';

export const opts = {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },  
  body: JSON.stringify({ query, variables })
};


const res = await fetch(url, opts)

const json = await res.json();
const balances = json.data.balances;


let results = [];
balances.forEach(obj => {
  // console.log(obj.transactionHash);
  results.push(obj.transactionHash)
});
console.log(`There are ${results.length} txn hashes`)
fs.writeFileSync('txns/txns.js', JSON.stringify([results]));

const header = ['Txns'];

const csvHashes = converter.convertArrayToCSV([results], {
  header,
  separator: ';'
});

fs.writeFileSync('txns/csv-txns.js', JSON.stringify(csvHashes));