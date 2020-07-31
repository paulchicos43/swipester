import React, { useState, useEffect } from 'react';
import { Container, Card, CardItem, Body, Text, Spinner, DeckSwiper } from 'native-base';
import { Animated, FlatList, TouchableWithoutFeedback, PanResponder, View } from 'react-native';

import AnimatedCard from './AnimatedCard'
import firebase from 'firebase'
require('firebase/firestore');
export default function App({ route, navigation }) {
    const [selected, setSelected] = useState([])
    const [companies, setCompanies] = useState([])
    const [loading, setLoading] = useState(true)
    const axios = require('axios')
    const query = firebase.firestore().collection('swipes').where("swipedBy", "==", firebase.auth().currentUser.uid).orderBy("time", "desc").limit(20);
    useEffect(() => {
        query.onSnapshot(querySnapshot => {
            const list = [];
            querySnapshot.forEach(doc => {
                    list.push({
                        swipedOn: doc.get('swipedOn'),
                        swipedOnName: doc.get('swipedOnName'),
                        swipeAction: doc.get('swipeAction'),
                        shares: 0,
    
                    });
            })
            setCompanies(list);
            setLoading(false);
        });
    }, []);

    const removeFromCompaniesList = (item) => {
        const symbol = item.swipedOn
        var newList = []
        for (var elem of companies) {
            if(elem.swipedOn !== symbol) {

                newList.push(elem)
            }
        }
        setCompanies(newList)
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
        var newArray = []
        for(var thing of selected) {
            if(thing.swipedOn !== item.swipedOn) {
                newArray.push(thing)
            }
        }
        
        setSelected(newArray)
        navigation.setParams({
            selected: selected
        })
    }


    
    
    return (
        !loading ?
        <Container>
            <FlatList 
            data = { companies }
            renderItem = {
                ({item}) => 
                    (
                    <AnimatedCard handleAdd = { addToSelectedList } handleRemove = { removeFromSelectedList } handleExit = { removeFromCompaniesList } item = {item} />
                    )
            }
            />
        </Container>
        :
        <Container style = {{justifyContent: 'center'}}>
            <Spinner color = 'red' />
        </Container>
    );
}