const clean = [
    {token_name:"weth",date:"2021-02-18",price_usd:1844.309213484835},
    {token_name:"weth",date:"2021-02-18",price_usd:1844.309213484835},
    {token_name:"weth",date:"2021-03-01",price_usd:1412.6961126291376},
    {token_name:"weth",date:"2021-03-09",price_usd:1835.7260259067073},
    {token_name:"ethereum-stake",date:"2021-03-30",price_usd:4.218956940770755},
    {token_name:"weth",date:"2021-04-05",price_usd:2077.2253948688967},
    {token_name:"ethereum-stake",date:"2021-04-12",price_usd:4.982088653402111},
    {token_name:"robot",date:"2021-05-03",price_usd:93.21125031337039},
    {token_name:"ethereum-stake",date:"2021-05-11",price_usd:8.116908686637844},
    {token_name:"weth",date:"2021-05-27",price_usd:2867.1305042806207},
    {token_name:"robot",date:"2021-05-27",price_usd:64.28966433055665},
    {token_name:"ethereum-stake",date:"2021-05-27",price_usd:5.539608925121847},
    {token_name:"weth",date:"2021-06-15",price_usd:2583.204831234673},  
    {token_name:"nftx",date:"2021-06-16",price_usd:57.99510419712591},  
    {token_name:"daohaus",date:"2021-06-25",price_usd:10.583726391913975},  
    {token_name:"weth",date:"2021-06-30",price_usd:2180.1623520089356},  
    {token_name:"robot",date:"2021-07-15",price_usd:37.85547433451409},  
    {token_name:"ethereum-stake",date:"2021-07-15",price_usd:3.2866501407206026},  
    {token_name:"weth",date:"2021-07-19",price_usd:1901.734548786804},  
    {token_name:"weth",date:"2021-07-27",price_usd:2229.461315472253}]


const dirty = [{"token_name":"weth","date":"18-2-2021","price_usd":1844.309213484835},{"token_name":"weth","date":"18-2-2021","price_usd":1844.309213484835},{"token_name":"weth","date":"1-3-2021","price_usd":1412.6961126291376},{"token_name":"weth","date":"9-3-2021","price_usd":1835.7260259067073},{"token_name":"ethereum-stake","date":"30-3-2021","price_usd":4.218956940770755},{"token_name":"weth","date":"5-4-2021","price_usd":2077.2253948688967},{"token_name":"ethereum-stake","date":"12-4-2021","price_usd":4.982088653402111},{"token_name":"robot","date":"3-5-2021","price_usd":93.21125031337039},{"token_name":"ethereum-stake","date":"11-5-2021","price_usd":8.116908686637844},{"token_name":"weth","date":"27-5-2021","price_usd":2867.1305042806207},{"token_name":"robot","date":"27-5-2021","price_usd":64.28966433055665},{"token_name":"ethereum-stake","date":"27-5-2021","price_usd":5.539608925121847},{"token_name":"weth","date":"15-6-2021","price_usd":2583.204831234673},{"token_name":"nftx","date":"16-6-2021","price_usd":57.99510419712591},{"token_name":"daohaus","date":"25-6-2021","price_usd":10.583726391913975},{"token_name":"weth","date":"30-6-2021","price_usd":2180.1623520089356},{"token_name":"robot","date":"15-7-2021","price_usd":37.85547433451409},{"token_name":"ethereum-stake","date":"15-7-2021","price_usd":3.2866501407206026},{"token_name":"weth","date":"19-7-2021","price_usd":1901.734548786804},{"token_name":"weth","date":"27-7-2021","price_usd":2229.461315472253}]
  
// write function to format in a column, change the dates to YYYY-MM-DD format, and remove the quotes from the keys
const format = (arr) => {
    return arr.map((item) => {
        const date = item.date.split('-').reverse().join('-');
        const token_name = item.token_name;
        const price_usd = item.price_usd;
        return {token_name, date, price_usd}
    })
}

const result = await format(dirty);

console.log(result)
