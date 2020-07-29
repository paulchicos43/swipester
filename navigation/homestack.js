import Login from '../components/Login';
import Review from '../components/Review';
import SectorStack from './SectorStack'
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { NavigationContainer } from '@react-navigation/native'
import IconAwesome from 'react-native-vector-icons/FontAwesome'
import IconNextAwesome from 'react-native-vector-icons/MaterialCommunityIcons'
import ReviewStack from './ReviewStack'
import React from 'react'

const Tab = createBottomTabNavigator()
function MyTabs() {
  return (
        <Tab.Navigator>
            <Tab.Screen name="Swipe" component={ SectorStack }  
                options={{
                    tabBarLabel: 'Swipe',
                    tabBarIcon: ({ color, size }) => (
                    <IconNextAwesome name='card' color = { color } size = { size } />
                    ),
                }}
            />
            <Tab.Screen name="Review" component={ ReviewStack }  
                options={{
                    tabBarLabel: 'Review',
                    tabBarIcon: ({ color, size }) => (
                    <IconNextAwesome name='cart' size = {size} color = {color} />
                    ),
                }}
            />
        </Tab.Navigator>
  );
}
const Stack = createStackNavigator()
export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen 
                name = "Login"
                component = { Login }
                />
                <Stack.Screen 
                name = "Home"
                component = { MyTabs }
                options = {{
                    headerShown: false,
                    gestureEnabled: false,
                }}
                
                />
            </Stack.Navigator>
        </NavigationContainer>
    )
}