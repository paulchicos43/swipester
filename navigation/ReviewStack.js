import { createStackNavigator } from '@react-navigation/stack'
import Review from '../components/Review'
import { Button } from 'react-native'
import Alpaca from '../components/Alpaca'
import React, { useState } from 'react'
import firebase from 'firebase'
import Confirmation from '../components/Confirmation'
import orderReview from '../components/OrderReview'
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
                                if(!firebase.auth().currentUser.emailVerified) {
                                    alert("You must verify your email before trading.")
                                    return
                                }
                                navigation.navigate("orderReview", {
                                    order: route.params.selected,
                                    tradeType: route.params.tradeType,
                                })
                            } } title = "Next" />,
                            headerLeft: () => null,
                            gestureEnabled: false,
                        })
                    }
                />
                <Stack.Screen
                    name = "orderReview"
                    component = { orderReview }
                    options = {
                        ({ route, navigation }) => ({
                        headerRight: () =>
                        <Button onPress = {
                            async () => {
                                if(route.params.order.length != 0){
                                    var orderResults = []
                                    for(let stock of route.params.order){
                                        if(stock.shares > 0){
                                            const result = await firebase.functions().httpsCallable('makeOrder')({
                                                symbol: stock.swipedOn,
                                                shares: stock.shares,
                                                swipeAction: stock.swipeAction,
                                                tradeType: route.params.tradeType
                                            })
                                            .catch(() => {
                                                navigation.navigate('Alpaca')
                                            })
                                            orderResults[orderResults.length] = result.data
                                        }
                                    }
                                    navigation.navigate("orderConfirmation", {
                                        orderResults: orderResults
                                    })
                            }
                        }} title = "Trade"/>,
                        title: "Confirm your Order" 
                        
                        
                    })
                }
                />
                <Stack.Screen 
                    name = "orderConfirmation"
                    component = { Confirmation }
                    options = {{
                        title: "Confirmation"
                    }}
                />
                <Stack.Screen
                    name = "Alpaca"
                    component = { Alpaca }
                    options = {({navigation, route}) => ({
                        headerLeft: () => null,
                        gestureEnabled: false,
                        headerRight: () => <Button onPress = { () => navigation.navigate("Review") } title = "Done" />,
                        
                    })}
                />
            </Stack.Navigator>
    )
}