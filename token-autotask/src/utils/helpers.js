// date needs to be in this format for coingecko and then reversed for hasura
function unixToDate() {
  var date = new Date();
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

module.exports = { unixToDate, getCorrectId };
