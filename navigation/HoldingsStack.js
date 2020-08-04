import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import Holdings from '../components/Holdings'
const Stack = createStackNavigator()
export default function App() {
    return (
        <Stack.Navigator>
            <Stack.Screen 
                component = { Holdings }
                name = "Holdings"
                options = {{
                    headerLeft: () => null,
                    gestureEnabled: false,
                }}
            />
        </Stack.Navigator>
    )
}