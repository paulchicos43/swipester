const axios = require('axios')

const options = {
	headers: {
		Authorization: 'Bearer b23e125b-18fb-493d-bbf7-7c03c969a9a4'
	}
}

axios.get('https://paper-api.alpaca.markets/v2/assets/AAL', options)
.then(result => {
console.log(result)
}).catch(error => {
console.log(error)
})
