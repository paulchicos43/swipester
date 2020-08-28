const axios = require('axios')
const sectorJSON = require('./sectors.json')
let url = 'https://cloud.iexapis.com/stable/rules/create'
for(let obj of sectorJSON) { //Cycle through all stocks in JSON
    let webhookURL = 'https://us-central1-swipesta-2b989.cloudfunctions.net/handleWebhook'
    axios.post( //Start a request to the server
        url,
        {
            token: 'sk_8d788b1e7128491b97cdc83f7e85af00',
            ruleSet: obj.Symbol,
            type: 'any',
            ruleName: obj.Symbol + ' Update',
            conditions: [ //THESE ARE THE CONDITIONS RIGHT NOW. 0 stands for 0% per IEXCloud API, so if the value changes at all, it calls the webhook.
                ['revenue', '>', 0],
                ['revenue', '<', 0],
            ],
            outputs: [
                {
                    frequency: 60, // 60 seconds
                    method: 'webhook', //
                    to: webhookURL,
                }
            ]
        },)
        .then(result => {
            console.log(result)
        })
        .catch(error => {
            console.log(error)
        })
}



//Deletion Code

// let data
// axios.get('https://cloud.iexapis.com/stable/rules?token=sk_8d788b1e7128491b97cdc83f7e85af00')
// .then(result => {
//     data = result.data
//     console.log(data)
//     for(let item of data) {
//         console.log(item.id)
//         axios.delete('https://cloud.iexapis.com/stable/rules/' + item.id + '?token=sk_8d788b1e7128491b97cdc83f7e85af00')
//         .then(result => {
//             console.log(result)
//         })
//         .catch(error => {
//             console.log(error)
//         })
//     }
// })