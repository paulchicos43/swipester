import React, { useState, useEffect } from 'react'
import { Container, Text, Card, CardItem, Body } from 'native-base'
import { FlatList,View } from 'react-native'
export default function App({ navigation, route }) {
    const [orderResults, setOrderResults] = useState([])
    useEffect(() => {
        setOrderResults(route.params.orderResults)
    }, [])
    return (
        <Container>
            <FlatList 
                data = { orderResults }
                renderItem = {({item}) => {
                    console.log(item)
                    if(item === null) {
                        return (null)
                    }
                    return (
                    <Card style = {{ elevation: 0.3 }}>
                        <CardItem>
                            <Body>
                                <Text>Client Order ID: { item.client_order_id }</Text>
                                <Text>Created At: { item.created_at }</Text>
                                <Text>Symbol: { item.symbol }</Text>
                                <Text>Side: { item.side }</Text>
                                <Text>Quantity: { item.qty }</Text>
                                <Text>Stop Price: { item.stop_price }</Text>
                            </Body>
                        </CardItem>
                    </Card>
                    )
                }}
                keyExtractor = {(item) => (item)}
            />
        </Container>
    )
}