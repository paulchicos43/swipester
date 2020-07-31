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