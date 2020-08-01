import React, { useState, useEffect } from 'react';
import { Container, Spinner } from 'native-base';
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
    useEffect(() => {
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
                }, 450)
                
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
    return (
        !loading ?
        <Container>
            <FlatList 
            data = { companies }
            renderItem = {
                ({item}) => 
                    (
                    <AnimatedCard prices = { prices || null } handleAdd = { addToSelectedList } handleRemove = { removeFromSelectedList } handleExit = { removeFromCompaniesList } item = {item} />
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