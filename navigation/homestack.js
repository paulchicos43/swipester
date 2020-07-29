import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import Login from '../components/Login';
import Home from '../components/Home';
import Sectors from '../components/Sectors';
import SwipeScreen from '../components/SwipeScreen';
import Review from '../components/Review';
import Cart from '../components/Cart';
import Alpaca from '../components/Alpaca';
const stack = createStackNavigator({
    Login: {
        screen: Login,
        navigationOptions: {
            headerShown: false,
        }  
    },
    Home: {
        screen: Home,
        navigationOptions: {
            headerShown: false,
            gestureEnabled: false,
        }
    },
    Sectors: {
        screen: Sectors,
        navigationOptions: {
            headerShown: false,
        }
    },
    SwipeScreen: {
        screen: SwipeScreen,
        navigationOptions: {
            headerShown: false,
        }
    },
    Review: {
        screen: Review,
        navigationOptions: {
            headerShown: false,
        },
    },
    Cart: {
        screen: Cart,
        navigationOptions: {
            headerShown: false,
        }
    },
    Alpaca: {
        screen: Alpaca,
        navigationOptions: {
            headerShown: false,
        }
    }
});

export default createAppContainer(stack);