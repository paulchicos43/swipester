import { createStackNavigator } from '@react-navigation/stack'
import Review from '../components/Review'
import { Button } from 'react-native'
import Alpaca from '../components/Alpaca'
import React from 'react'
import firebase from 'firebase'
const axios = require('axios')
const Stack = createStackNavigator()
export default function App() {
    return (
            <Stack.Navigator>
                <Stack.Screen 
                name = "Review"
                component = { Review }
                initialParams = {{ selected: [], }}
                options = {
                    ({route, navigation}) => ({
                        headerRight: () => <Button onPress = { () => {
                            for(let stock of route.params.selected){
                                if(stock.shares > 0){
                                    axios({
                                        method: 'post',
                                        url: 'https://us-central1-swipesta-2b989.cloudfunctions.net/makeOrder',
                                        headers: {}, 
                                        data: {
                                        uid: firebase.auth().currentUser.uid, // This is the body part
                                        symbol: stock.swipedOn,
                                        shares: stock.shares,
                                        swipeAction: stock.swipeAction
                                        }
                                    });
                                }
                            }
                            alert("Order placed. Will execute shortly.");
                        } } title = "Buy" />,
                        headerLeft: () => null,
                        gestureEnabled: false,
                    })
                }
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