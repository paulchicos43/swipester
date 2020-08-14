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





    return (
        !loading ? 
        <Container>
            <Title>Diversification Score: { Math.min(holdings.length/20 * 100, 100) }</Title>
            <FlatList 
                data = { holdings }
                renderItem = {({item}) => (
                    <Card style = {{ elevation: 0.3 }}>
                        <CardItem>
                            <Body>
                                <Title style = { { alignSelf: 'center' } }>{ item.symbol }</Title>
                                <Text>Market Value: { item.market_value }</Text>
                                <Text>Side: { item.side }</Text>
                                <Text>Percent Change: { item.unrealized_plpc }</Text>
                                <Text>Current Price: { item.current_price }</Text>
                                <Text>Quantity: { item.qty }</Text>
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