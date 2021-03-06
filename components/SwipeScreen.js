import React, { useState, useEffect } from 'react';
import { Container, Title, Spinner, Body, DeckSwiper, Button, Text, Card, CardItem } from 'native-base';
import { StyleSheet, View, YellowBox } from 'react-native';
import RenderCard from './RenderCard';
import firebase from 'firebase';
import AsyncStorage from '@react-native-community/async-storage';

const axios = require('axios');
require('firebase/firestore');
require('firebase/functions');
export default function App({ route,navigation }) {
    var numberOfSwipes = 0
    const sectorData = require('../sectors.json');
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const [stocks, setStocks] = useState([])
    var currentStock = ""
    useEffect(() => {
        var sto = [];
        for(let object in sectorData){
            if(sectorData[object]['Sector'] === route.params.title){
                    sto[sto.length] = {
                        symbol: sectorData[object]['Symbol'],
                        title: sectorData[object]['Name'],
                    };
            } 
        }
        setStocks(sto)
        if(loading){
            getSectorProgress(route.params.title)
            .then(result => {
                setProgress(parseInt(result));
                setLoading(false);
            })
        }
    }, [])
    const getSectorProgress = async (sector) => {
        return await AsyncStorage.getItem(sector)
    }
    const incrementSector = async (sector) => {
        var result = await AsyncStorage.getItem(sector)
        await AsyncStorage.setItem(sector, "" + (parseInt(result) + 1))
    }
    const resetDeck = async (sector) => {
        await AsyncStorage.setItem(sector, "0")
    }

    useEffect(() => {
        YellowBox.ignoreWarnings(["Animated: `useNativeDriver` was not specified. This is a required option and must be explicitly set to `true` or `false`"]);
        YellowBox.ignoreWarnings(["Unhandled promise rejection: Error: Response is not valid JSON object."]);
        
    });
    const handleLike = async () => {
        
        if(stocks.slice(progress + 1).length === 0) {
            alert('You\'ve reached the end of the deck.')
            resetDeck(route.params.title)
            navigation.navigate('Sectors')
        }
        numberOfSwipes = numberOfSwipes + 1
        if(numberOfSwipes === 10) {
            alert("Nice! You've swiped ten times. You can keep going or review your current swipes.")
            numberOfSwipes = 0
        }
        await incrementSector(route.params.title)
        const likeObject = {
            swipeAction: 'right',
            swipedBy: firebase.auth().currentUser.uid,
            swipedOn: currentStock,
            active: true,
            swipedOnName: currentName,
            time: getTime(),
        };
        await firebase.functions().httpsCallable('addSwipeItem')(likeObject)
    }
    const getTime = () => {
        const time = new Date().toString();
        const parts = time.split(" ");
        var final = "";
        var month = 0;
        if(parts[1] === "Jan"){
            month = 0;
        } else if (parts[1] === "Feb") {
            month = 1;
        } else if (parts[1] === "Mar") {
            month = 2;
        } else if (parts[1] === "Apr") {
            month = 3;
        } else if (parts[1] === "May") {
            month = 4;
        } else if (parts[1] === "Jun") {
            month = 5;
        } else if (parts[1] === "Jul") {
            month = 6;
        } else if (parts[1] === "Aug") {
            month = 7
        } else if (parts[1] === "Sep") {
            month = 8;
        } else if (parts[1] === "Oct") {
            month = 9;
        } else if (parts[1] === "Nov") {
            month = 10;
        } else {
            month = 11;
        }
        var day = parts[2];
        var year = parts[3];
        var timeSplit = parts[4].split(":");
        var hour = timeSplit[0];
        var minute = timeSplit[1];
        var second = timeSplit[2];
        final = final + year + month + day + hour + minute + second;
        return parseInt(final);
    }
    const handleDislike = async () => {
        const shortable = await isShortable(currentStock)
        if(!shortable) {
            alert("This stock is not shortable. It will not be included in the review page.")
            return
        }
        const dislikeObject = {
            swipeAction: 'left',
            swipedBy: firebase.auth().currentUser.uid,
            swipedOnName: currentName,
            active: true,
            swipedOn: currentStock,
            time: getTime(),
        };
        if(stocks.slice(progress + 1).length === 0) {
            alert('You\'ve reached the end of the deck.')
            resetDeck(route.params.title)
            navigation.navigate('Sectors')
        }
        numberOfSwipes = numberOfSwipes + 1
        if(numberOfSwipes === 10) {
            alert("Nice! You've swiped ten times. You can keep going or review your current swipes.")
            numberOfSwipes = 0
        }
        await incrementSector(route.params.title)
        await firebase.functions().httpsCallable('addSwipeItem')(dislikeObject)
    }
    var currentName = ""
    const [_deckSwiper, set_DeckSwiper] = useState()
    const isShortable = async (symbol) => {
        let url = 'https://api.alpaca.markets/v2/assets/'
        const doc = await firebase.firestore().collection('response').doc(firebase.auth().currentUser.uid).get()
        const options = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': doc.data().token_type + " " + doc.data().access_token,
            }
        }
        const result = await axios.get(url + symbol, options)
        return result.data.shortable
    }
    return (
        !loading ?
        <Container>
        <Container>
            <View>
                <Title/>
                <DeckSwiper
                    ref={(c) => set_DeckSwiper(c)}
                    style = {{useNativeDriver: true,}}
                    dataSource={ stocks.slice(progress) }
                    renderItem={ item => {
                        currentStock = item.symbol
                        currentName = item.title
                        return (
                            <RenderCard title = { item.title } symbol = { item.symbol }/>
                        );
                        }
                    }
                    renderBottom = {() =>         
                    <Card style={{ elevation: 3, }}>
                        <CardItem style = {{height: 600,}}>
                            <Body>
                                <Container style = {{ alignSelf: 'center', justifyContent: 'center' }}>
                                    <Spinner color = 'red' />
                                </Container>
                            </Body>
                        </CardItem>
                        
                    </Card>
                }
                    onSwipeLeft = { handleDislike }
                    onSwipeRight = { handleLike }
                />
                
            </View>
            
        </Container>
        <Button onPress = { () => _deckSwiper._root.swipeRight() } block><Text>Skip</Text></Button>
        </Container>
        :
        <Container style = { styles.spinner }>
            <Spinner color = 'blue' />
        </Container>
    )
}

const styles = StyleSheet.create({
    spinner: {
        justifyContent: 'center',
    },
    title: {
        fontSize: 30,
        alignSelf: 'center',
    },
    subtitle: {
        fontSize: 30,
    }
});