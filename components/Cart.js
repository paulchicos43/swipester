import React, {useState, useEffect} from 'react';
import { Container, Content, Text, Spinner } from 'native-base';
import { YellowBox, FlatList, Button } from 'react-native';
import CartItem from './CartItem';
import firebase from 'firebase';
const axios = require('axios')
require('firebase/functions')

export default function App({ navigation, route }) {
    const [selected, setSelected] = useState(route.params.selected);
    const [buyingPower, setBuyingPower] = useState(0);
    const [loading, setLoading] = useState(true);
    const handlePress = () => {
        for(let stock of selected){
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
        alert("Order placed. Will execute shortly.");
        navigation.navigate("Review");
    }
    if(loading){
        axios({
            method: 'post',
            url: 'https://us-central1-swipesta-2b989.cloudfunctions.net/getBalance',
            headers: {}, 
            data: {
            uid: firebase.auth().currentUser.uid, // This is the body part
            }
        })
        .then(result => {
            setBuyingPower(result.data);
            setLoading(false);
        })
        .catch(error => {
            alert("You need to link an Alpaca Account")
            navigation.push("Alpaca")
            

        })
    }


    const propogate = (title, value) => {
        for(var i = 0; i < selected.length; i++) {
            if(selected[i].swipedOn === title) {
                console.log(selected[i].shares)
                selected[i].shares = Math.floor(value);
            }
        }
    }
    useEffect(() => {
        YellowBox.ignoreWarnings(["VirtualizedLists should never be nested inside plain ScrollViews with the same orientation - use another VirtualizedList-backed container instead."]);
    });
    return (
        !loading ?
        <Container>
            <Content>
                <Text style = {{alignSelf: 'center'}}>Buying Power: { buyingPower }</Text>
                <FlatList
                windowSize = { 10 }
                data = { selected }
                style = {{marginTop: 20,}}
                renderItem = { ({item}) =>{
                    return <CartItem propogate = { propogate } fullTitle = { item.swipedOnName } title = { item.swipedOn } />
                    }
                }
                />
                <Button title = "Make Order" onPress = { handlePress } />
            </Content>
            
        </Container>
        :
        <Container style = {{ justifyContent: 'center' }}>
            <Spinner color = 'red' />
        </Container>
    );
}