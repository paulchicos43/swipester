import React, { useState, useEffect } from 'react'
import { Container, Text } from 'native-base'
import RenderCard from './RenderCard'

export default function App({ navigation, route }) {
    return (
        <Container>
            <RenderCard title = { route.params.item.stockName } symbol = { route.params.item.stockSymbol }/>
        </Container>
    )
}
