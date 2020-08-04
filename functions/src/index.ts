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

exports.makeOrder = functions.https.onRequest(async (req, res) => {
    let action = '';
    if(req.body.swipeAction === 'right') {
        action = 'buy'
    } else {
        action = 'sell'
    }
    const postData = {
        symbol: req.body.symbol,
        qty: req.body.shares,
        side: action,
        type: 'market',
        time_in_force: 'day',
    };
    const doc = await admin.firestore().collection('response').doc(req.body.uid).get()
    const options = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': doc.data().token_type + " " + doc.data().access_token,
        }
    }
    const url = "https://paper-api.alpaca.markets/v2/orders";
    const result = await axios.post(url, postData, options).catch((error: any) => {console.log(error); res.send(403)})
    console.log(result.data);
    res.send(200);
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

exports.getCache = functions.https.onCall(async (data, context) => {
    const databaseResult = await admin.firestore().collection('cache').doc(data.symbol).get()
    if(databaseResult.exists) {
        return databaseResult.data()
    } else {
        const iexBatchResult = await axios.get('https://sandbox.iexapis.com/stable/stock/' + data.symbol + '/batch?types=advanced-stats,financials,recommendation-trends,stats,income,chart&range=6m&token=Tsk_47aba52e64214057b138bb7b57e751f7')
        const EBITDA = iexBatchResult.data['advanced-stats'].EBITDA
        const enterpriseValue = iexBatchResult.data['advanced-stats'].enterpriseValue
        const PE = iexBatchResult.data['advanced-stats'].forwardPERatio
        const netDebt = iexBatchResult.data.financials.financials[0].shortTermDebt + iexBatchResult.data.financials.financials[0].longTermDebt + iexBatchResult.data.financials.financials[0].currentDebt - iexBatchResult.data.financials.financials[0].totalCash
        const sales = iexBatchResult.data.financials.financials[0].totalRevenue;
        const buys = iexBatchResult.data['recommendation-trends'][iexBatchResult.data['recommendation-trends'].length - 1].ratingBuy + iexBatchResult.data['recommendation-trends'][iexBatchResult.data['recommendation-trends'].length - 1].ratingOverweight
        const holds = iexBatchResult.data['recommendation-trends'][iexBatchResult.data['recommendation-trends'].length - 1].ratingHold
        const sells = iexBatchResult.data['recommendation-trends'][iexBatchResult.data['recommendation-trends'].length - 1].ratingSell + iexBatchResult.data['recommendation-trends'][iexBatchResult.data['recommendation-trends'].length - 1].ratingUnderweight
        const eps = iexBatchResult.data.stats.ttmEPS
        admin.firestore().collection('cache').doc(data.symbol).set({
            EBITDA: EBITDA,
            enterpriseValue: enterpriseValue,
            PE: PE,
            netDebt: netDebt,
            sales: sales,
            buys: buys,
            holds: holds,
            sells: sells,
            eps: eps,
        })
        return {
                EBITDA: EBITDA,
                enterpriseValue: enterpriseValue,
                PE: PE,
                netDebt: netDebt,
                sales: sales,
                buys: buys,
                holds: holds,
                sells: sells,
                eps: eps,
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