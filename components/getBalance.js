const axios = require('axios');

let options = {
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer 56037799-7130-44bb-8911-a897201b019c',
    }
}
const url = "https://paper-api.alpaca.markets/v2/account";
axios.get(url, options)
.then((result) => {
    console.log(result.data.buying_power);
})
.catch((err) => {
    console.log(err);
})