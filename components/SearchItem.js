import React, { useState, useEffect } from 'react'
import { Button, Text } from 'native-base'

export default function App({ stockName }) {
    return (
        <Text>{ stockName }</Text>
    )
}