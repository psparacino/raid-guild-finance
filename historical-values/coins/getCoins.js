import fs from "fs";

async function getCoins() {
  try {
    const COINS = await fetch("https://api.coingecko.com/api/v3/coins/list");
    const coins = await COINS.json();
    fs.writeFile("coins.js", JSON.stringify(coins), (err) => {
      if (err) throw err;
      console.log("coin info successfully saved");
    });
    return coins;
  } catch (error) {
    console.error(error);
  }
}

getCoins();
