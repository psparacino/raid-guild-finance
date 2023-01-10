import COINS from "./data/coins.js";
// import fetch from "node-fetch";
// convert above to require
const fetch = require("node-fetch");


// date needs to be in this format for coingecko and then reversed for hasura
function unixToDate(timestamp) {
  var date = new Date(timestamp * 1000);
  var day = date.getDate();
  var month = date.getMonth() + 1;
  var year = date.getFullYear();

  return `${year}-${month}-${day}`;
}

function getCorrectId(tokenId) {
  const id = tokenId.toLowerCase();
  switch (id) {
    case "xdai-stake":
      return "ethereum-stake";
    case "ancient-raid":
      return "raid-token";
    case "gtc":
      return "gitcoin";
    case "unicorn-token":
      return "uniswap";
    default:
      return id;
  }
}

// export async function createTokenIdObject(balances) {
// alert below is for testing
export async function createTokenIdObject() {
  const coins = COINS;
  const balanceObjects = [];
  const balances = [
    {
      id: "0xfe1084bc16427e5eb7f13fc19bcd4e641f7d571f-14615497-0x6a023ccd1ff6f2045c3309768ead9e68f978f6e1",
      transactionHash:
        "0xb2869c9be268a6a176cdab887b8576a3e1c2b46fd3eb3169abca7bc7ed53879c",
      timestamp: "1613690540",
      balance: "1000000000000000",
      tokenSymbol: "BTC",
    },
    // {
    //   "id": "0xfe1084bc16427e5eb7f13fc19bcd4e641f7d571f-14615534-0x6a023ccd1ff6f2045c3309768ead9e68f978f6e1",
    //   "transactionHash": "0xfdb3fc244a3b71ab53b735e15b01485263a6905f49bcd4beeb5cdca14d7d95d4",
    //   "timestamp": "1613690735",
    //   "balance": "72760600000000000000",
    //   "tokenSymbol": "WETH"
    // },
    // {
    //   "id": "0xfe1084bc16427e5eb7f13fc19bcd4e641f7d571f-14793029-0x6a023ccd1ff6f2045c3309768ead9e68f978f6e1",
    //   "transactionHash": "0x613f3ec492b83a45fc9b10a2cb6b8d6dfa33b4c3d4e1925782bfb8e01da5d693",
    //   "timestamp": "1614606100",
    //   "balance": "72372505338068301448",
    //   "tokenSymbol": "WETH"
    // },
    // {
    //   "id": "0xfe1084bc16427e5eb7f13fc19bcd4e641f7d571f-14932001-0x6a023ccd1ff6f2045c3309768ead9e68f978f6e1",
    //   "transactionHash": "0x00fa2474ddfe527fa89eb2711d018f1908e7d0385a351f131754b19581a4d300",
    //   "timestamp": "1615341395",
    //   "balance": "68192879345534460925",
    //   "tokenSymbol": "WETH"
    // },
    // {
    //   "id": "0xfe1084bc16427e5eb7f13fc19bcd4e641f7d571f-15275193-0xb7d311e2eb55f2f68a9440da38e7989210b9a05e",
    //   "transactionHash": "0xfbd5c3c6207fac375b9dbf05be97e50b4f5bdb0f9305f88aee1a45abf1105618",
    //   "timestamp": "1617090965",
    //   "balance": "4000000000000000000",
    //   "tokenSymbol": "STAKE"
    // },
    // {
    //   "id": "0xfe1084bc16427e5eb7f13fc19bcd4e641f7d571f-15381831-0x6a023ccd1ff6f2045c3309768ead9e68f978f6e1",
    //   "transactionHash": "0x7b89dd2d8654939d4451be284600a5f6d0c4227814f1fa5f33259320053ab91b",
    //   "timestamp": "1617630220",
    //   "balance": "52192879345534460925",
    //   "tokenSymbol": "WETH"
    // },
    // {
    //   "id": "0xfe1084bc16427e5eb7f13fc19bcd4e641f7d571f-15506955-0xb7d311e2eb55f2f68a9440da38e7989210b9a05e",
    //   "transactionHash": "0xcb64070c3638b2cc427c14398eff3d55c236b9701ac6763bef63620a98b6d7e2",
    //   "timestamp": "1618268470",
    //   "balance": "8400000000000000000",
    //   "tokenSymbol": "STAKE"
    // },
    // {
    //   "id": "0xfe1084bc16427e5eb7f13fc19bcd4e641f7d571f-15869556-0x8d02b73904856de6998ffdf6e7ee18cc21137a79",
    //   "transactionHash": "0xb93c7dec6d13ccf4c008ea8de3e320a21ee81eb6a10bf1b076be6455ef22e192",
    //   "timestamp": "1620086195",
    //   "balance": "30150000000000000000",
    //   "tokenSymbol": "ROBOT"
    // },
    // {
    //   "id": "0xfe1084bc16427e5eb7f13fc19bcd4e641f7d571f-15992610-0xb7d311e2eb55f2f68a9440da38e7989210b9a05e",
    //   "transactionHash": "0xbc2a7d416a3fa14ef5fe5f657bfd4e5844b75be95e310b1931c2283ec75575be",
    //   "timestamp": "1620708305",
    //   "balance": "16202500000000000000",
    //   "tokenSymbol": "STAKE"
    // },
    // {
    //   "id": "0xfe1084bc16427e5eb7f13fc19bcd4e641f7d571f-16262260-0x6a023ccd1ff6f2045c3309768ead9e68f978f6e1",
    //   "transactionHash": "0xfc1c8b580cd2198260c67e766382a1e35df4aaaeb42a01a9fa13cc47a0b6afa2",
    //   "timestamp": "1622088495",
    //   "balance": "51911276418496223028",
    //   "tokenSymbol": "WETH"
    // },
    // {
    //   "id": "0xfe1084bc16427e5eb7f13fc19bcd4e641f7d571f-16262260-0x8d02b73904856de6998ffdf6e7ee18cc21137a79",
    //   "transactionHash": "0xfc1c8b580cd2198260c67e766382a1e35df4aaaeb42a01a9fa13cc47a0b6afa2",
    //   "timestamp": "1622088495",
    //   "balance": "29987327843248615647",
    //   "tokenSymbol": "ROBOT"
    // },
    // {
    //   "id": "0xfe1084bc16427e5eb7f13fc19bcd4e641f7d571f-16262260-0xb7d311e2eb55f2f68a9440da38e7989210b9a05e",
    //   "transactionHash": "0xfc1c8b580cd2198260c67e766382a1e35df4aaaeb42a01a9fa13cc47a0b6afa2",
    //   "timestamp": "1622088495",
    //   "balance": "16115080576458895358",
    //   "tokenSymbol": "STAKE"
    // },
    // {
    //   "id": "0xfe1084bc16427e5eb7f13fc19bcd4e641f7d571f-16593663-0x6a023ccd1ff6f2045c3309768ead9e68f978f6e1",
    //   "transactionHash": "0xd6002949d58cf2577313cf2a12506b4e844f038eba45b4050280f9f18b561a10",
    //   "timestamp": "1623791820",
    //   "balance": "52661276418496223028",
    //   "tokenSymbol": "WETH"
    // },
    // {
    //   "id": "0xfe1084bc16427e5eb7f13fc19bcd4e641f7d571f-16615359-0x8e1a12da00bbf9db10d48bd66ff818be933964d5",
    //   "transactionHash": "0xb415ca7b7f39166d50c61b70688810b03db90988feba365dc339ff5034b532cb",
    //   "timestamp": "1623900510",
    //   "balance": "800000000000000000",
    //   "tokenSymbol": "NFTX"
    // },
    {
      id: "0xfe1084bc16427e5eb7f13fc19bcd4e641f7d571f-16762363-0xb0c5f3100a4d9d9532a4cfd68c55f1ae8da987eb",
      transactionHash:
        "0x8e5c9abe68484e428e58d4f8e06adac02eb479b3e07737c0efca28c5997a1f6b",
      timestamp: "1624641175",
      balance: "66600000000000000000",
      tokenSymbol: "ETH",
    },
    // {
    //   "id": "0xfe1084bc16427e5eb7f13fc19bcd4e641f7d571f-16848088-0x6a023ccd1ff6f2045c3309768ead9e68f978f6e1",
    //   "transactionHash": "0x18e07d5ba173dff2fba82870def1d0b0860a76e9ce36df3005ddfd158590ef58",
    //   "timestamp": "1625077700",
    //   "balance": "52911276418496223028",
    //   "tokenSymbol": "WETH"
    // },
    // {
    //   "id": "0xfe1084bc16427e5eb7f13fc19bcd4e641f7d571f-17089496-0x8d02b73904856de6998ffdf6e7ee18cc21137a79",
    //   "transactionHash": "0xbeaf09175c888443bc1a6a6e79182ecb38d85fc8291e54358ad11246f3af14bd",
    //   "timestamp": "1626387870",
    //   "balance": "44162327843248615647",
    //   "tokenSymbol": "ROBOT"
    // },
    // {
    //   "id": "0xfe1084bc16427e5eb7f13fc19bcd4e641f7d571f-17089499-0xb7d311e2eb55f2f68a9440da38e7989210b9a05e",
    //   "transactionHash": "0xfc8ee607697a9c78fcfdf6478891f673ec14cf57e7b892b2b3efa01713749752",
    //   "timestamp": "1626387885",
    //   "balance": "44115080576458895358",
    //   "tokenSymbol": "STAKE"
    // },
    // {
    //   "id": "0xfe1084bc16427e5eb7f13fc19bcd4e641f7d571f-17154552-0x6a023ccd1ff6f2045c3309768ead9e68f978f6e1",
    //   "transactionHash": "0xd36c36b6b60d6217d5891ae66ccfa3b9581fbbdda3cf5bbdee3c4ff5893448ea",
    //   "timestamp": "1626735980",
    //   "balance": "52953976418496223028",
    //   "tokenSymbol": "WETH"
    // },
    // {
    //   "id": "0xfe1084bc16427e5eb7f13fc19bcd4e641f7d571f-17289144-0x6a023ccd1ff6f2045c3309768ead9e68f978f6e1",
    //   "transactionHash": "0xec31ca82e635317eeffc92000f037ae97db6d72c81c94c47e73ca751e1d013b6",
    //   "timestamp": "1627428445",
    //   "balance": "52309419354965421138",
    //   "tokenSymbol": "WETH"
    // },
    // {
    //   "id": "0xfe1084bc16427e5eb7f13fc19bcd4e641f7d571f-17289144-0x8d02b73904856de6998ffdf6e7ee18cc21137a79",
    //   "transactionHash": "0xec31ca82e635317eeffc92000f037ae97db6d72c81c94c47e73ca751e1d013b6",
    //   "timestamp": "1627428445",
    //   "balance": "43624782935792216421",
    //   "tokenSymbol": "ROBOT"
    // },
    // {
    //   "id": "0xfe1084bc16427e5eb7f13fc19bcd4e641f7d571f-17289144-0x8e1a12da00bbf9db10d48bd66ff818be933964d5",
    //   "transactionHash": "0xec31ca82e635317eeffc92000f037ae97db6d72c81c94c47e73ca751e1d013b6",
    //   "timestamp": "1627428445",
    //   "balance": "790262380925853713",
    //   "tokenSymbol": "NFTX"
    // },
    // {
    //   "id": "0xfe1084bc16427e5eb7f13fc19bcd4e641f7d571f-17289144-0xb0c5f3100a4d9d9532a4cfd68c55f1ae8da987eb",
    //   "transactionHash": "0xec31ca82e635317eeffc92000f037ae97db6d72c81c94c47e73ca751e1d013b6",
    //   "timestamp": "1627428445",
    //   "balance": "65789343212077321598",
    //   "tokenSymbol": "HAUS"
    // },
    // {
    //   "id": "0xfe1084bc16427e5eb7f13fc19bcd4e641f7d571f-17289144-0xb7d311e2eb55f2f68a9440da38e7989210b9a05e",
    //   "transactionHash": "0xec31ca82e635317eeffc92000f037ae97db6d72c81c94c47e73ca751e1d013b6",
    //   "timestamp": "1627428445",
    //   "balance": "43578110763860362205",
    //   "tokenSymbol": "STAKE"
    // },
    // {
    //   "id": "0xfe1084bc16427e5eb7f13fc19bcd4e641f7d571f-17468997-0x6a023ccd1ff6f2045c3309768ead9e68f978f6e1",
    //   "transactionHash": "0x28f95cfa54daada5e52c2a809c7320827352c44a14cba3c3e22b951fd0e86cea",
    //   "timestamp": "1628350825",
    //   "balance": "52954019354965421138",
    //   "tokenSymbol": "WETH"
    // },
    // {
    //   "id": "0xfe1084bc16427e5eb7f13fc19bcd4e641f7d571f-17856893-0x6a023ccd1ff6f2045c3309768ead9e68f978f6e1",
    //   "transactionHash": "0x4c8fbb9591dea872df7a44f37ec6770a7477e083990b10cb85d333f0a5e9f4ab",
    //   "timestamp": "1630419075",
    //   "balance": "42954019354965421138",
    //   "tokenSymbol": "WETH"
    // },
    // {
    //   "id": "0xfe1084bc16427e5eb7f13fc19bcd4e641f7d571f-17972308-0xb7d311e2eb55f2f68a9440da38e7989210b9a05e",
    //   "transactionHash": "0x42f6fd3f993b4e60521af5063a9d5801c8ad915f27cb82760637257e65976bd9",
    //   "timestamp": "1631022825",
    //   "balance": "56388110763860362205",
    //   "tokenSymbol": "STAKE"
    // },
    // {
    //   "id": "0xfe1084bc16427e5eb7f13fc19bcd4e641f7d571f-18062873-0x6a023ccd1ff6f2045c3309768ead9e68f978f6e1",
    //   "transactionHash": "0x67933a47f48fc61ff45ba1c385842cb1d9f988e0da19d3265a174cbb023ea778",
    //   "timestamp": "1631493125",
    //   "balance": "39954019354965421138",
    //   "tokenSymbol": "WETH"
    // },
    // {
    //   "id": "0xfe1084bc16427e5eb7f13fc19bcd4e641f7d571f-18091285-0x6a023ccd1ff6f2045c3309768ead9e68f978f6e1",
    //   "transactionHash": "0x62a970c5b55e4c57fd8b1a6ae1b266f7e9b68a469c93374229795433d66e74dd",
    //   "timestamp": "1631641660",
    //   "balance": "39994019354965421138",
    //   "tokenSymbol": "WETH"
    // },
    // {
    //   "id": "0xfe1084bc16427e5eb7f13fc19bcd4e641f7d571f-18204079-0xb0c5f3100a4d9d9532a4cfd68c55f1ae8da987eb",
    //   "transactionHash": "0x852750cb2d70a92bd1f83577605d27cdd5063e21d1f31d8d5d7facbb4b604508",
    //   "timestamp": "1632255450",
    //   "balance": "165789343212077321598",
    //   "tokenSymbol": "HAUS"
    // },
    // {
    //   "id": "0xfe1084bc16427e5eb7f13fc19bcd4e641f7d571f-18209629-0x256f3a3b6897298ce11d34c0695c7cf49c15d1b3",
    //   "transactionHash": "0x0a2247861f63c00072772ff20014f9226bdd2de5f358015b231e834937f23207",
    //   "timestamp": "1632284015",
    //   "balance": "1581138830080000000000",
    //   "tokenSymbol": "UNI-V2"
    // },
    // {
    //   "id": "0xfe1084bc16427e5eb7f13fc19bcd4e641f7d571f-18335779-0xb0c5f3100a4d9d9532a4cfd68c55f1ae8da987eb",
    //   "transactionHash": "0x10e4f8aebd21318fba6c4625f3b178f1ce760cd580de6953988ee101388185c6",
    //   "timestamp": "1632948725",
    //   "balance": "65789343212077321598",
    //   "tokenSymbol": "HAUS"
    // },
    // {
    //   "id": "0xfe1084bc16427e5eb7f13fc19bcd4e641f7d571f-18413955-0xb7d311e2eb55f2f68a9440da38e7989210b9a05e",
    //   "transactionHash": "0xc7d214890f24290c99b4f93255a11a545e0e3c718f31eee14799c3b80a95c6ca",
    //   "timestamp": "1633380570",
    //   "balance": "64389110763860362205",
    //   "tokenSymbol": "STAKE"
    // },
    // {
    //   "id": "0xfe1084bc16427e5eb7f13fc19bcd4e641f7d571f-19102243-0xb7d311e2eb55f2f68a9440da38e7989210b9a05e",
    //   "transactionHash": "0xfb846eb5246119f568bcc1903783af5e64ce0ea7176c19ff48731441ebce461e",
    //   "timestamp": "1637078395",
    //   "balance": "72389110763860362205",
    //   "tokenSymbol": "STAKE"
    // },
    // {
    //   "id": "0xfe1084bc16427e5eb7f13fc19bcd4e641f7d571f-19467636-0x256f3a3b6897298ce11d34c0695c7cf49c15d1b3",
    //   "transactionHash": "0x3eb3608ce285e19bab6764a9af6fd65a0920b83fb2e7f3a6934e743767010594",
    //   "timestamp": "1638937295",
    //   "balance": "1567789569432305203772",
    //   "tokenSymbol": "UNI-V2"
    // },
    // {
    //   "id": "0xfe1084bc16427e5eb7f13fc19bcd4e641f7d571f-19467636-0x6a023ccd1ff6f2045c3309768ead9e68f978f6e1",
    //   "transactionHash": "0x3eb3608ce285e19bab6764a9af6fd65a0920b83fb2e7f3a6934e743767010594",
    //   "timestamp": "1638937295",
    //   "balance": "39656357298628868484",
    //   "tokenSymbol": "WETH"
    // }
  ];

  for (let i = 0; i < balances.length; i++) {
    const balance = balances[i];

    const txnID = balance.id;
    const transactionHash = balance.transactionHash;

    const symbol =
      balance.tokenSymbol === "UNI-V2"
        ? "uni"
        : balance.tokenSymbol.toLowerCase();
    const date = unixToDate(balance.timestamp);

    const match = Object.entries(coins).find(([key, coin]) => {
      return coin.symbol === symbol && coin.symbol !== "wxdai";
    });

    if (match == undefined) {
      return null;
    } else {
      const id = getCorrectId(match[1].id);
      balanceObjects.push(
        Object.assign({}, { date }, { id }, { txnID }, { transactionHash })
      );
    }
  }
  return balanceObjects;
}

export async function getCurrentTokenPrice(balances) {
  let values = [];

  const promises = balances.map(async (balance) => {
    const { id, date, txnID } = balance;
    // space out calls to minimize chance of rate limiting
    await new Promise((resolve) => setTimeout(resolve, 2000));

    try {
      const res = await fetch(`https://api.coingecko.com/api/v3/coins/${id}`);
      const tokenInfo = await res.json();
      const price = await tokenInfo.market_data.current_price.usd;

      const tokenData = { token_name: id, date, price_usd: price, txnID };

      values.push(tokenData);
    } catch (error) {
      console.error("coingecko api error", id, date, error);
    }
  });

  await Promise.all(promises);

  return values;
}
