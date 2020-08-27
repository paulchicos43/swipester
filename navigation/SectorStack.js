import { createStackNavigator } from '@react-navigation/stack'
import Sectors from '../components/Sectors'
import SwipeScreen from '../components/SwipeScreen'
import React from 'react'
import { Button } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage';
import firebase from 'firebase'
const Stack = createStackNavigator()

const resetStorage = async () => {
    await AsyncStorage.setItem('Energy', '0');
    await AsyncStorage.setItem('Materials', '0');
    await AsyncStorage.setItem('Industrials', '0');
    await AsyncStorage.setItem('Consumer Staples', '0');
    await AsyncStorage.setItem('Health Care', '0');
    await AsyncStorage.setItem('Financials', '0');
    await AsyncStorage.setItem('Information Technology', '0');
    await AsyncStorage.setItem('Communication Services', '0');
    await AsyncStorage.setItem('Utilities', '0');
    await AsyncStorage.setItem('Real Estate', '0');
    alert('Ok, let\'s get started again!')
}

export default function App() {
    return (
            <Stack.Navigator>
                <Stack.Screen 
                name = "Sectors"
                component = { Sectors }
                headerShown = {false}
                options = {{
                    headerLeft: () => <Button onPress = { () => firebase.auth().signOut() } title = "Log Out" />,
                    headerRight: () => <Button onPress = { resetStorage } title = "Reset" />,
                    gestureEnabled: false,
                }
                }
                />
                <Stack.Screen 
                name = "SwipeScreen"
                component = { SwipeScreen }
                options = {({route}) => (
                    {
                        title: route.params.title,
                        gestureEnabled: false,
                    })}
                />
            </Stack.Navigator>
    )
}