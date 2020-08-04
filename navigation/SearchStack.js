import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import Search from '../components/Search'
import Profile from '../components/Profile'

const Stack = createStackNavigator()
export default function App() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name = "Search"
                component = { Search }
                options = {{
                    gestureEnabled: false,
                    headerLeft: () => null,
                }}
            />
            <Stack.Screen
                name = "Profile"
                component = { Profile }
                options = {({route}) => ({
                    title: route.params.item.stockName,
                })}
            />
        </Stack.Navigator>
    )
}