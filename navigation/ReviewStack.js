import { createStackNavigator } from '@react-navigation/stack'
import Review from '../components/Review'
import { Button } from 'react-native'
import Alpaca from '../components/Alpaca'
import React, { useState } from 'react'
import firebase from 'firebase'
import Confirmation from '../components/Confirmation'
require('firebase/functions')
const Stack = createStackNavigator()

export default function App() {
    return (
            <Stack.Navigator>
                <Stack.Screen 
                    name = "Review"
                    component = { Review }
                    initialParams = {{ selected: [], tradeType: 'paper'}}

                    options = {
                        ({route, navigation}) => ({
                            headerRight: () => 
                            <Button onPress = { async () => {
                                if(route.params.selected.length != 0){
                                    var orderResults = []
                                    for(let stock of route.params.selected){
                                        if(stock.shares > 0){
                                            const result = await firebase.functions().httpsCallable('makeOrder')({
                                                symbol: stock.swipedOn,
                                                shares: stock.shares,
                                                swipeAction: stock.swipeAction,
                                                tradeType: route.params.tradeType
                                            })
                                            orderResults[orderResults.length] = result.data
                                        }
                                    }
                                    navigation.navigate("Confirmation", {
                                        orderResults: orderResults
                                    })
                                } else {
                                    alert("You must select a stock.")
                                }
                            } } title = "Buy" />,
                            headerLeft: () => null,
                            gestureEnabled: false,
                        })
                    }
                />
                <Stack.Screen 
                    name = "Confirmation"
                    component = { Confirmation }
                    options = {{

                    }}
                />
                <Stack.Screen
                    name = "Alpaca"
                    component = { Alpaca }
                    options = {({navigation, route}) => ({
                        headerLeft: () => null,
                        gestureEnabled: false,
                        headerRight: () => <Button onPress = { () => navigation.navigate("Review") } title = "Done" />
                    })}
                />
            </Stack.Navigator>
    )
}