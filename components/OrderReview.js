import React, { useEffect } from 'react'
import { StyleSheet, FlatList } from 'react-native'
import { Container, Text, Title, CardItem, Card } from 'native-base'
export default function App({ navigation, route }) {
    return (
    <Container>
        <FlatList
        data = { route.params.order }
        renderItem = {({ item }) => {
            if(item.shares != 0) {
                return (
                    <Card>
                        <CardItem style = {{ flexDirection: 'column' }}>
                            <Title>Name: { item.swipedOnName }</Title>
                            <Text>Shares: { item.shares }</Text>
                        </CardItem>
                    </Card>
                )
            }
        }}
        />
        
    </Container>
    )
}

const styles = StyleSheet.create({

})