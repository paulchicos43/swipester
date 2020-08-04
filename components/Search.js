import React, {useState, useEffect} from 'react'
import { Header, Item, Input, Container, ListItem, Icon } from 'native-base'
import SearchItem from './SearchItem'
import { TouchableOpacity, FlatList } from 'react-native'
import Profile from './Profile'
export default function App({ navigation, route }) {
    const [results, setResults] = useState([])
    const [searchValue, setSearchValue] = useState("")
    const [stocks, setStocks] = useState([])
    const sectorData = require('../sectors.json');
    
    useEffect(() => {
        const tempResults = []
        
        for(stock of stocks) {
            if(searchValue.length <= stock.stockName.length && searchValue.toUpperCase() === stock.stockName.substring(0, searchValue.length).toUpperCase()) {             
                tempResults[tempResults.length] = {
                    stockName: stock.stockName,
                    stockSymbol: stock.stockSymbol
                }
            }
        }
        setResults(tempResults)
    }, [searchValue])

    useEffect(() => {
        const tempStocks = []
        for(let object in sectorData){
            tempStocks[tempStocks.length] = {
                stockSymbol: sectorData[object]['Symbol'],
                stockName: sectorData[object]['Name'],
            }
        }
        setStocks(tempStocks)
    }, [])



    return (
        <Container>
            <Header searchBar rounded>
                <Item>
                    <Icon name = 'ios-search' />
                    <Input onChangeText = { (value) => setSearchValue(value) } placeholder = "Apple" />
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