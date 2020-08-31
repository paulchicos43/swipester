import React, {useState, useEffect} from 'react'
import { Header, Item, Input, Container, ListItem, Icon } from 'native-base'
import SearchItem from './SearchItem'
import { TouchableOpacity, FlatList } from 'react-native'
import Profile from './Profile'
import firebase from 'firebase'
const axios = require('axios')
export default function App({ navigation, route }) {
    const [results, setResults] = useState([])
    const [searchValue, setSearchValue] = useState("")
    const [stocks, setStocks] = useState([])
    let sectorData
    useEffect(async () => {
        const doc = await firebase.firestore().collection('response').doc(firebase.auth().currentUser.uid).get()
        const options = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': doc.data().token_type + " " + doc.data().access_token,
            }
        }
        sectorData = await axios.get('https://api.alpaca.markets/v2/assets', options)
        let tempStocks = []
        for(let object of sectorData.data){
            tempStocks[tempStocks.length] = {
                stockSymbol: object.symbol,
                stockName: object.name,
            }
        }
        
        setStocks(tempStocks)
        console.log(stocks)
    }, [])
    useEffect(() => {
        const tempResults = []
        
        for(let stock of stocks) {
            if((searchValue.length <= stock.stockName.length && searchValue.toUpperCase() === stock.stockName.substring(0, searchValue.length).toUpperCase()) || searchValue.toUpperCase() === stock.stockSymbol.toUpperCase()) {             
                tempResults[tempResults.length] = {
                    stockName: stock.stockName,
                    stockSymbol: stock.stockSymbol
                }
            }
        }
        setResults(tempResults)
    }, [searchValue])




    return (
        <Container>
            <Header searchBar rounded>
                <Item>
                    <Icon name = 'ios-search' />
                    <Input onChangeText = { (value) => setSearchValue(value) } placeholder = "Apple or AAPL" />
                </Item>
            </Header>
            <FlatList
                data = { results.slice(0, results.length/2 + 1) }
                renderItem = { ({ item }) => (
                    <ListItem>
                        <TouchableOpacity onPress = { () => navigation.navigate('Profile', { item: item }) }>
                            <SearchItem stockName = { item.stockName } />
                        </TouchableOpacity>
                    </ListItem>
                )}
                keyExtractor = { (item) => item.stockName }
            />
        </Container>
    )
}