import React, { useState, useEffect } from 'react'
import firebase from 'firebase'
require('firebase/functions')
import { Container, Card, CardItem, Text, Title, Body } from 'native-base'
import { FlatList } from 'react-native'


export default function App({ navigation, route }) {

    const [holdings, setHoldings] = useState([])
    useEffect(() => {
        firebase.functions().httpsCallable('getPositions')()
        .then(result => {
            setHoldings(result.data)
        })
        return;
    }, [])





    return (
        <Container>
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
            />
        </Container>
    )
}