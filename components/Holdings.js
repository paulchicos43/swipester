import React, { useState, useEffect } from 'react'
import firebase from 'firebase'
require('firebase/functions')
import { Container, Card, CardItem, Text, Title, Body, Spinner } from 'native-base'
import { FlatList } from 'react-native'
import { useIsFocused } from '@react-navigation/native'


export default function App({ navigation, route }) {
    const isFocused = useIsFocused()
    const [loading, setLoading] = useState(true)
    const [holdings, setHoldings] = useState([])
    useEffect(() => {
        setLoading(true)
        firebase.functions().httpsCallable('getPositions')()
        .then(result => {
            setHoldings(result.data)
            setLoading(false)
        })
        return;
    }, [isFocused])


    const getSumSquared = () => {
        let sum = 0
        for(let item of holdings) {
            sum = sum + Math.pow(percentOfPositions(item.market_value), 2)
        }
        console.log(holdings.length)
        return sum
    }
    const percentOfPositions = (num) => {
        let sum = 0
        for(let item of holdings) {
            sum = sum + item.market_value
        }
        return (num / sum) * 100
    }

    return (
        !loading ? 
        <Container>
            <Title>Diversification Score: { holdings.length > 1 ? (1 - getSumSquared())/ (1 - 1 / holdings.length) : 0 }% (out of 100%)</Title>
            <FlatList 
                data = { holdings }
                renderItem = {({item}) => (
                    <Card style = {{ elevation: 0.3 }}>
                        <CardItem>
                            <Body>
                                <Title style = { { alignSelf: 'center' } }>{ item.symbol }</Title>
                                <Text>Market Value: ${ item.market_value }</Text>
                                <Text>Side: { item.side === 'long' ? 'Long' : 'Short' }</Text>
                                <Text>Percent Change: { (item.unrealized_plpc * 100).toFixed(2) }%</Text>
                                <Text>Current Price: ${ item.current_price }</Text>
                                <Text>Shares: { item.qty }</Text>
                            </Body>
                        </CardItem>
                    </Card>
                )}
                keyExtractor = {(item) => (
                    item.symbol
                )}
            />
        </Container>
        :
        <Container style = {{ justifyContent: 'center' }}>
            <Spinner color = 'red' />
        </Container>
    )
}