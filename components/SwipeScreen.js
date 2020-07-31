import React, { useState, useEffect } from 'react';
import { Container, Title, Spinner, Body, DeckSwiper, Card, CardItem } from 'native-base';
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
    var currentStock = ""
    var stocks = [];
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
    for(let object in sectorData){
        if(sectorData[object]['Sector'] === route.params.title){
                stocks[stocks.length] = {
                    symbol: sectorData[object]['Symbol'],
                    title: sectorData[object]['Name'],
                };
        } 
    }
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
    if(loading){
        getSectorProgress(route.params.title)
        .then(result => {
            setProgress(parseInt(result));
            setLoading(false);
        })
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
            alert("You've swiped 10 times.")
            numberOfSwipes = 0
        }
        await incrementSector(route.params.title)
        const likeObject = {
            swipeAction: 'right',
            swipedBy: firebase.auth().currentUser.uid,
            swipedOn: currentStock,
            swipedOnName: currentName,
            time: getTime(),
        };
        await firebase.firestore().collection('swipes').add(likeObject);
    }

    const handleDislike = async () => {
        
        if(stocks.slice(progress + 1).length === 0) {
            alert('You\'ve reached the end of the deck.')
            resetDeck(route.params.title)
            navigation.navigate('Sectors')
        }
        numberOfSwipes = numberOfSwipes + 1
        if(numberOfSwipes === 10) {
            alert("You've swiped 10 times.")
            numberOfSwipes = 0
        }
        await incrementSector(route.params.title)
        const dislikeObject = {
            swipeAction: 'left',
            swipedBy: firebase.auth().currentUser.uid,
            swipedOnName: currentName,
            swipedOn: currentStock,
            time: getTime(),
        };
        await firebase.firestore().collection('swipes').add(dislikeObject)
    }
    var currentName = ""
    return (
        !loading ?
        <Container>
            <View>
                <Title/>
                <DeckSwiper
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