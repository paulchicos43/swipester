import React, { useState, useEffect } from 'react';
import { Container, Spinner, Segment, Header, Button, Text } from 'native-base';
import { FlatList} from 'react-native';
import { useIsFocused } from '@react-navigation/native'

import AnimatedCard from './AnimatedCard'
import firebase from 'firebase'
require('firebase/firestore');
export default function App({ route, navigation }) {
    const [selected, setSelected] = useState([])
    const [companies, setCompanies] = useState([])
    const [loading, setLoading] = useState(true)
    const axios = require('axios')
    const query = firebase.firestore().collection('swipes').where("swipedBy", "==", firebase.auth().currentUser.uid).where("active","==",true).orderBy("time", "desc").limit(20);
    const isFocused = useIsFocused()
    const [prices, setPrices] = useState({})
    const [loggedIn, setLoggedIn] = useState(false)
    useEffect(() => {
            setSelected([])
            navigation.setParams({
                selected: selected,
            })
            setLoading(true)
            query.get().then(querySnapshot => {
                const list = [];
                var string = ""
                querySnapshot.forEach(doc => {
                        string = string +  doc.get('swipedOn') + ','
                        list.push({
                            swipedOn: doc.get('swipedOn'),
                            swipedOnName: doc.get('swipedOnName'),
                            swipeAction: doc.get('swipeAction'),
                            shares: 0,
                        });
                })
                axios.get('https://sandbox.iexapis.com/stable/stock/market/batch?symbols='+ string + '&types=price&token=Tsk_47aba52e64214057b138bb7b57e751f7')
                .then(result => setPrices(result.data))
                setCompanies(list);
                setTimeout(() => {
                    setLoading(false);
                }, 500)
                
        });
    }, [isFocused]);

    const removeFromCompaniesList = (item) => {
        setCompanies(companies.slice().filter(elem => elem.swipedOn !== item.swipedOn))
    }

    const addToSelectedList = (item) => {
        var newArray = selected
        newArray.push(item)
        setSelected(newArray)
        navigation.setParams({
            selected: selected
        })
    }

    const removeFromSelectedList = (item) => {
        setSelected(selected.slice().filter(thing => thing.swipedOn !== item.swipedOn))
        navigation.setParams({
            selected: selected
        })
    }
    const [activeView, setActiveView] = useState(true)
    const [activeTradeType, setActiveTradeType] = useState(true)
    firebase.functions().httpsCallable("getHoldingNumber")({ searchStock: 'aapl' })
    .catch(() => {
        navigation.navigate('Alpaca')
    })
    return (
        
        !loading ?
        <Container>
            <Segment>
                <Button first onPress = {() => setActiveView(true)} active = {activeView}>
                    <Text>Longs</Text>
                </Button>
                <Button last onPress = {() => setActiveView(false)} active = {!activeView}>
                    <Text>Shorts</Text>
                </Button>
            </Segment>
            <Segment>
                <Button first onPress = {() => {setActiveTradeType(true); navigation.setParams({ tradeType: 'paper' })}} active = {activeTradeType}>
                    <Text>Paper</Text>
                </Button>
                <Button last onPress = {() => {setActiveTradeType(false); navigation.setParams({ tradeType: 'real' })}} active = {!activeTradeType}>
                    <Text>Real</Text>
                </Button>
            </Segment>
            <FlatList 
                data = { companies.slice().filter(item => {if(activeView) { return item.swipeAction !== 'left' } else {return item.swipeAction !== 'right'}}) }
                renderItem = {
                    ({item}) => 
                        (
                        <AnimatedCard selected = { selected } prices = { prices } handleAdd = { addToSelectedList } handleRemove = { removeFromSelectedList } handleExit = { removeFromCompaniesList } item = {item} />
                        )
                }
                keyExtractor = {(item) => item.swipedOn }
            />
        </Container>
        :
        <Container style = {{justifyContent: 'center'}}>
            <Spinner color = 'red' />
        </Container>
    );
}