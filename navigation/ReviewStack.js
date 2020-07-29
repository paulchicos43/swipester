import { createStackNavigator } from '@react-navigation/stack'
import Review from '../components/Review'
import { Button } from 'react-native'
import Cart from '../components/Cart'
import Alpaca from '../components/Alpaca'
import React from 'react'

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
                        
                            navigation.push("Cart", {
                                selected: route.params.selected
                            })
                        } } title = "Next" />,
                        headerLeft: () => null,
                        gestureEnabled: false,
                    })
                }
                />
                <Stack.Screen 
                name = "Cart"
                component = { Cart }
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