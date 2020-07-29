import React, {useState, useEffect} from 'react';
import { Header, Title, Container, Left, Right, Body, Content, Button, Text, Icon, Spinner } from 'native-base';
import { YellowBox, FlatList } from 'react-native';
import CartItem from './CartItem';
import firebase from 'firebase';
const axios = require('axios')
require('firebase/functions')

export default function App({ navigation }) {
    const [selected, setSelected] = useState(navigation.getParam('selected'));
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
                  symbol: stock.title,
                  shares: stock.shares,
                  swipeAction: stock.swipeAction
                }
              });
        }
        alert("Order placed. Will execute shortly.");
        navigation.navigate("Home");
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
            alert("You must have an alpaca account linked before going here.")
            navigation.navigate('Review')
        })
    }


    const propogate = (title, value) => {
        for(var i = 0; i < selected.length; i++) {
            if(selected[i].title === title) {
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
            <Header>
                <Left>
                    <Button onPress = { () => navigation.navigate('Review') } transparent>
                        <Icon name = "arrow-back" />
                    </Button>
                </Left>
                <Body>
                    <Title>Cart</Title>
                    <Text>BP: $ { buyingPower }</Text>
                </Body>
                <Right>
                    <Button onPress = { handlePress } transparent>
                        <Text>Buy</Text>
                    </Button>
                </Right>
            </Header>
            <Content>
                <FlatList
                windowSize = { 10 }
                data = { selected }
                renderItem = { ({item}) =>{
                    return <CartItem propogate = { propogate } title = { item.title } />
                    }
                }
                />
            </Content>
        </Container>
        :
        <Container style = {{ justifyContent: 'center' }}>
            <Spinner color = 'red' />
        </Container>
    );
}