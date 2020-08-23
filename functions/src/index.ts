import * as functions from 'firebase-functions';
const admin = require('firebase-admin');
const request = require('request');
admin.initializeApp();
const axios = require('axios');

exports.redirectURI = functions.https.onRequest((req, res) => {
    const code = req.query.code;
    const uid = req.query.state
    const options = {
        url: 'https://api.alpaca.markets/oauth/token',
        form: {
            grant_type: 'authorization_code',
            code: code,
            client_id: '9d563410f5503d25b91f3b71a2830cc9',
            client_secret: 'adf639b3a4d5676f0447c5655f92974c1577a4a1',
            redirect_uri: 'https://us-central1-swipesta-2b989.cloudfunctions.net/redirectURI',
        }
    };
    request.post(options, async (err: String, result: String, body: string) => {
        if(err) {
            console.log(err);
            res.send(400);
        } else {
            const object = JSON.parse(body);
            await admin.firestore().collection('response').doc(uid).set(object)
            res.send(200)
        }
    });
});

exports.makeOrder = functions.https.onCall(async (data, context) => {
    const tradeType = data.tradeType
    let action = '';
    if(data.swipeAction === 'right') {
        action = 'buy'
    } else {
        action = 'sell'
    }
    let postData = {
        symbol: data.symbol,
        qty: data.shares,
        side: action,
        type: 'market',
        time_in_force: 'day',
    };
    const doc = await admin.firestore().collection('response').doc(context.auth?.uid).get()
    const options = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': doc.data().token_type + " " + doc.data().access_token,
        }
    }
    let url = ""
    if(tradeType === 'paper'){
        url = "https://paper-api.alpaca.markets/v2/orders"
    } else {
        url = "https://api.alpaca.markets/v2/orders"
    }
    var result = await axios.post(url, postData, options)
    .catch(async (error: any) => {
        await axios.delete('https://paper-api.alpaca.markets/v2/positions/' + data.symbol, options)
        setTimeout(async () => {
            const holdingNumber = await getHoldingNumber(data.symbol, context.auth?.uid)
            postData = {
                symbol: data.symbol,
                qty: data.shares + holdingNumber,
                side: action,
                type: 'market',
                time_in_force: 'day',
            };
            result = await axios.post(url, postData, options)
            return result.data
        }, 1000)
        
        
    })
    return result.data
})

exports.getBalance = functions.https.onRequest(async (req, res) => {
    const doc = await admin.firestore().collection('response').doc(req.body.uid).get()
    const result = await axios.get("https://paper-api.alpaca.markets/v2/account", {
        headers: {
            'Authorization': doc.data().token_type + ' ' + doc.data().access_token,
        }
    })
    res.send("" + result.data.buying_power)
})

exports.addSwipeItem = functions.https.onCall(async (data, context) => {
    const ref = await admin.firestore().collection('swipes').where('swipedOn', '==', data.swipedOn).orderBy('time', 'desc').get()
    if(ref.docs[0] != null){
        admin.firestore().collection('swipes').doc(ref.docs[0].id).set({
            swipeAction: ref.docs[0].data().swipeAction,
            swipedBy: ref.docs[0].data().swipedBy,
            swipedOnName: ref.docs[0].data().swipedOnName,
            active: false,
            swipedOn: ref.docs[0].data().swipedOn,
            time: ref.docs[0].data().time
        })
    }
    admin.firestore().collection('swipes').add(data)
    return;
})
const sleep = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}
exports.getCache = functions.https.onCall(async (data, context) => {
    const databaseResult = await admin.firestore().collection('cache').doc(data.symbol).get()
    if(databaseResult.exists) {
        return databaseResult.data()
    } else {
        let EVEBITDA, PE, netDebtEBITDA, salesGrowth, ratingScore, epsGrowth, consensusEPS1, consensusEPS2, priceTarget, volatility, ratings: any
        try {
            EVEBITDA = await getEVEBITDA(data.symbol)
        } catch(error) {
            EVEBITDA = "N/A"
        }
        try {
            PE = await getTrailingPE(data.symbol)
        } catch(error) {
            PE = "N/A"
        }
        try {
            netDebtEBITDA = await getNetDebtEBITDA(data.symbol)
        } catch(error) {
            netDebtEBITDA = "N/A"
        }
        try {
            salesGrowth = await getSalesGrowth(data.symbol)
        } catch(error) {
            salesGrowth = "N/A"
        }
        try {
            ratingScore = await getRatingScore(data.symbol)
        } catch(error) {
            ratingScore = "N/A"
        }
        try {
            epsGrowth = await getEPSGrowth(data.symbol)
        } catch(error) {
            epsGrowth = "N/A"
        }
        try {
            consensusEPS1 = await getConsensusEPS1(data.symbol)
        } catch(error) {
            consensusEPS1 = "N/A"
        }
        try {
            consensusEPS2 = await getConsensusEPS2(data.symbol)
        } catch(error) {
            consensusEPS2 = "N/A"
        }
        try {
            priceTarget = await getPriceTarget(data.symbol)
        } catch(error) {
            priceTarget = "N/A"
        }
        try {
            volatility = await getVolatility(data.symbol)
        } catch(error) {
            volatility = "N/A"
        }
        try {
            ratings = await getRatings(data.symbol)
        } catch(error) {
            ratings = "N/A"
        }
        admin.firestore().collection('cache').doc(data.symbol).set({
            EVEBITDA: EVEBITDA,
            PE: PE,
            salesGrowth: salesGrowth,
            epsGrowth: epsGrowth,
            netDebtEBITDA: netDebtEBITDA,
            volatility: volatility,
            ratingScore: ratingScore,
            buys: ratings.ratingBuy,
            holds: ratings.ratingHold,
            sells: ratings.ratingSell,
            consensusEPS1: consensusEPS1,
            consensusEPS2: consensusEPS2,
            priceTarget: priceTarget,
        })
        return {
            EVEBITDA: EVEBITDA,
            PE: PE,
            salesGrowth: salesGrowth,
            epsGrowth: epsGrowth,
            netDebtEBITDA: netDebtEBITDA,
            volatility: volatility,
            ratingScore: ratingScore,
            buys: ratings.ratingBuy,
            holds: ratings.ratingHold,
            sells: ratings.ratingSell,
            consensusEPS1: consensusEPS1,
            consensusEPS2: consensusEPS2,
            priceTarget: priceTarget,
            }
    }
})

exports.getPositions = functions.https.onCall(async (data, context) => {
    const doc = await admin.firestore().collection('response').doc(context.auth?.uid).get()
    const result = await axios.get("https://paper-api.alpaca.markets/v2/positions", {
        headers: {
            'Authorization': doc.data().token_type + ' ' + doc.data().access_token,
        }
    })
    return result.data
})

exports.getHoldingNumber = functions.https.onCall(async (data, context) => {
    return await getHoldingNumber(data.searchStock, context.auth?.uid)
})
const getHoldingNumber = async (searchStock: any, uid: any) => {
    const doc = await admin.firestore().collection('response').doc(uid).get()
    const result = await axios.get("https://paper-api.alpaca.markets/v2/positions", {
        headers: {
            'Authorization': doc.data().token_type + ' ' + doc.data().access_token,
        }
    })
    for(let item of result.data) {
        if(item.symbol === searchStock) {
            return item.qty
        }
    }
    return 0
}
exports.handleRule = functions.https.onRequest((req, res) => {
    console.log(req)
    res.send(400)
})

const getMarketcap = async (symbol: string) => {
    await sleep(100)
    const iexBatchResult = await axios.get('https://sandbox.iexapis.com/stable/stock/' + symbol + '/batch?types=advanced-stats,price&token=Tpk_d5ea729178384954bb5301abc99328fa')
    const price = iexBatchResult.data.price
    const sharesOutstanding = iexBatchResult.data['advanced-stats'].sharesOutstanding
    return price * sharesOutstanding
}


const getEBITDA = async (symbol: string) => {
    await sleep(100)
    const iexBatchResult = await axios.get('https://sandbox.iexapis.com/stable/stock/' + symbol + '/batch?types=advanced-stats&token=Tpk_d5ea729178384954bb5301abc99328fa')
    return iexBatchResult.data['advanced-stats'].EBITDA
}

const getNetDebt = async (symbol: string) => {
    await sleep(100)
    const iexBatchResult = await axios.get('https://sandbox.iexapis.com/stable/stock/' + symbol + '/batch?types=balance-sheet,financials&token=Tpk_d5ea729178384954bb5301abc99328fa')
    const currentCash = iexBatchResult.data['balance-sheet']['balancesheet'][0].currentCash
    const shortTermInvestments = iexBatchResult.data['balance-sheet']['balancesheet'][0].shortTermInvestments
    const totalCash = currentCash + shortTermInvestments
    const totalDebt = iexBatchResult.data.financials.financials[0].totalDebt
    const netDebt = totalCash + totalDebt
    return netDebt
}

const getEnterpriseValue = async (symbol: string) => {
   await sleep(100)
    const marketCap = await getMarketcap(symbol)
    await sleep(100)
    const netDebt = await getNetDebt(symbol)
    return marketCap + netDebt
}

const getEVEBITDA = async (symbol: string) => {
    await sleep(100)
    const enterpriseValue = await getEnterpriseValue(symbol)
    await sleep(100)
    const EBITDA = await getEBITDA(symbol)
    if(EBITDA !== 0 && EBITDA !== null){
        return enterpriseValue / EBITDA
    } else {
        return "N/A"
    }
}
const getNetDebtEBITDA = async (symbol: string) => {
    await sleep(100)
    const netDebt = await getNetDebt(symbol)
    await sleep(100)
    const EBITDA = await getEBITDA(symbol)
    if(EBITDA !== 0 && EBITDA !== null){
        return netDebt / EBITDA
    } else  {
        return "N/A"
    }
}

const getTotalEPS = async (symbol: string) => {
    await sleep(100)
    const result = await axios.get('https://sandbox.iexapis.com/stable/stock/' + symbol + '/earnings/?last=4&token=Tpk_d5ea729178384954bb5301abc99328fa')
    let sum = 0
    for (let item of result.data.earnings) {
        sum += item.actualEPS
    }
    return sum
}
const getTrailingPE = async (symbol: string) => {
    await sleep(100)
    const price = await axios.get('https://sandbox.iexapis.com/stable/stock/' + symbol + '/price?token=Tsk_47aba52e64214057b138bb7b57e751f7')
    await sleep(100)
    const totalEPS = await getTotalEPS(symbol)
    if(totalEPS !== 0){
        return price.data / totalEPS
    } else {
        return "N/A"
    }
}

const getSalesGrowth = async (symbol: string) => {
    await sleep(100)
    const result = await axios.get('https://sandbox.iexapis.com/stable/stock/' + symbol + '/income?period=quarter&last=8&token=Tpk_d5ea729178384954bb5301abc99328fa')
    let firstFour = 0
    let secondFour = 0
    for(let i = 0; i < 4; i++) {
        firstFour += result.data.income[i].totalRevenue
    }
    for(let i = 4; i < 8; i++) {
        secondFour += result.data.income[i].totalRevenue
    }
    if(secondFour !== 0){
        return firstFour/(secondFour) - 1
    } else {
        return "N/A"
    }
}

const getEPSGrowth = async (symbol: string) => {
    await sleep(100)
    const consensusData = await axios.get('https://sandbox.iexapis.com/stable/stock/' + symbol + '/estimates?period=annual&last=1&token=Tsk_47aba52e64214057b138bb7b57e751f7')
    await sleep(100)
    const consensusEPS = consensusData.data.estimates[0].consensusEPS
    const annualData = await axios.get('https://sandbox.iexapis.com/stable/stock/' + symbol + '/earnings/1?period=annual&token=Tsk_47aba52e64214057b138bb7b57e751f7')
    const actualEPS = annualData.data.earnings[0].actualEPS
    if(actualEPS !== 0) {
        return consensusEPS / (actualEPS) - 1
    } else {
        return "N/A"
    }

}

const getVolatility = async (symbol: string) => {
    await sleep(100)
    const result = await axios.get('https://sandbox.iexapis.com/stable/stock/' + symbol + '/indicator/volatility?range=6m&input1=66&token=Tpk_d5ea729178384954bb5301abc99328fa')
    return result.data.indicator[0][result.data.indicator[0].length - 1]
}

const getRatingScore = async (symbol: string) => {
    await sleep(100)
    const ratingResults = await axios.get('https://sandbox.iexapis.com/stable/stock/' + symbol + '/recommendation-trends?period=quarter&last=8&token=Tpk_d5ea729178384954bb5301abc99328fa')
    const ratingBuy = ratingResults.data[0].ratingBuy + ratingResults.data[0].ratingOverweight
    const ratingHold = ratingResults.data[0].ratingHold
    const ratingSell = ratingResults.data[0].ratingSell + ratingResults.data[0].ratingUnderweight
    return (ratingBuy * 3 + ratingSell * 2 + ratingHold * 1) / (ratingBuy + ratingHold + ratingSell)
}
const getRatings = async (symbol: string) => {
    await sleep(100)
    const ratingResults = await axios.get('https://sandbox.iexapis.com/stable/stock/' + symbol + '/recommendation-trends?period=quarter&last=8&token=Tpk_d5ea729178384954bb5301abc99328fa')
    const ratingBuy = ratingResults.data[0].ratingBuy + ratingResults.data[0].ratingOverweight
    const ratingHold = ratingResults.data[0].ratingHold
    const ratingSell = ratingResults.data[0].ratingSell + ratingResults.data[0].ratingUnderweight
    return {
        ratingBuy: ratingBuy,
        ratingHold: ratingHold,
        ratingSell: ratingSell,
    }
}

const getConsensusEPS1 = async (symbol: string) => {
    await sleep(100)
    const result = await axios.get('https://sandbox.iexapis.com/stable/stock/' + symbol + '/estimates?period=quarter&last=1&token=Tpk_d5ea729178384954bb5301abc99328fa')
    return result.data.estimates[0].consensusEPS
}

const getConsensusEPS2 = async (symbol: string) => {
    await sleep(100)
    const result = await axios.get('https://sandbox.iexapis.com/stable/stock/' + symbol + '/estimates?period=annual&last=1&token=Tpk_d5ea729178384954bb5301abc99328fa')
    return result.data.estimates[0].consensusEPS
}

const getPriceTarget = async (symbol: string) => {
    await sleep(100)
    const result = await axios.get('https://sandbox.iexapis.com/stable/stock/' + symbol + '/price-target?token=Tpk_d5ea729178384954bb5301abc99328fa')
    return result.data.priceTargetAverage 
}





