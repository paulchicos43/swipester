var axios = require('axios');
var sandboxToken = 'Tpk_d5ea729178384954bb5301abc99328fa';
var symbol = 'aapl';

//We need Advanced Stats, Indicators param = 3, Stock Profiles, Analyst Recommendations
//Batch Requests, Income Statement, Key Stats

//Notice that brackets should be filled in
var advanced_stats_url = 'https://sandbox.iexapis.com/stable/stock/{symbol}/advanced-stats?token=Tsk_47aba52e64214057b138bb7b57e751f7'

var financials = 'https://sandbox.iexapis.com/stable/stock/{symbol}/financials?token=Tsk_47aba52e64214057b138bb7b57e751f7'

var indicator = 'https://sandbox.iexapis.com/stable/stock/{symbol}/indicator/volatility?range=ytd&token=Tsk_47aba52e64214057b138bb7b57e751f7'

var analyst = 'https://sandbox.iexapis.com/stable/stock/{symbol}/recommendation-trends?token=Tsk_47aba52e64214057b138bb7b57e751f7'

var key_stats = 'https://sandbox.iexapis.com/stable/stock/{symbol}/stats?token=Tsk_47aba52e64214057b138bb7b57e751f7'

var income_statement = 'https://sandbox.iexapis.com/stable/stock/aapl/income?token=Tsk_47aba52e64214057b138bb7b57e751f7'



//missing description, news, chart, logo
const getInfo = async () => {
    var enterpriseValue, netDebt, EBITDA, PE, volatility, buys, holds, sells, sales, eps
    console.log("Symbol: " + symbol);
    //Advanced States: EBITDA, enterpriseValue, PE
    setTimeout(async () => {
        const advancedStats = await axios.get('https://cloud.iexapis.com/stable/stock/' + symbol + '/advanced-stats?token=sk_8d788b1e7128491b97cdc83f7e85af00')
        EBITDA = advancedStats.data.EBITDA;
        enterpriseValue = advancedStats.data.enterpriseValue;
        PE = advancedStats.data.forwardPERatio
        console.log("Enterprise Value: " + enterpriseValue)
        console.log("EBITDA: " + EBITDA)
        console.log("PE: " + PE)
    }, 10)
    setTimeout(async () => {
        const financials = await axios.get('https://cloud.iexapis.com/stable/stock/' + symbol + '/financials?token=sk_8d788b1e7128491b97cdc83f7e85af00')
        var financialsData = financials.data.financials[0]
        var shortTermDebt = financialsData.shortTermDebt
        var longTermDebt = financialsData.longTermDebt
        var currentDebt = financialsData.currentDebt
        var currentCash = financialsData.totalCash
        netDebt = shortTermDebt + longTermDebt + currentDebt - currentCash
        console.log("Net Debt: " + netDebt)
    }, 10)
    setTimeout(async () => {
        const recs = await axios.get('https://cloud.iexapis.com/stable/stock/' + symbol + '/recommendation-trends?token=sk_8d788b1e7128491b97cdc83f7e85af00')
        var collection = recs.data[recs.data.length - 1]
        buys = collection.ratingBuy + collection.ratingOverweight;
        holds = collection.ratingHold
        sells = collection.ratingSell + collection.ratingUnderweight
        console.log("Buys: " + buys)
        console.log("Holds: " + holds)
        console.log("Sells: " + sells)
    }, 10)
    setTimeout(async () => {
        const indicator = await axios.get('https://cloud.iexapis.com/stable/stock/' + symbol + '/indicator/volatility?range=ytd&token=sk_8d788b1e7128491b97cdc83f7e85af00')
        volatility = indicator.data.indicator[0][indicator.data.indicator[0].length - 1]
        console.log("Volatility: " + volatility)
    }, 10)
    setTimeout(async () => {
        const stats = await axios.get('https://cloud.iexapis.com/stable/stock/' + symbol + '/stats?token=sk_8d788b1e7128491b97cdc83f7e85af00')
        eps = stats.data.ttmEPS
        console.log("EPS: " + eps);
    }, 10)
    setTimeout(async () => {
        const income = await axios.get('https://cloud.iexapis.com/stable/stock/' + 'aapl' + '/income?token=sk_8d788b1e7128491b97cdc83f7e85af00')
        sales = income.data.income[0].totalRevenue
        console.log("Sales: " + sales);
    }, 10)
}
getInfo()







