import React, { useState, useEffect } from 'react'
import { Container, Text, Button } from 'native-base'
import RenderCard from './RenderCard'
import firebase from 'firebase'

export default function App({ navigation, route }) {
    const handleDislike = async () => {
        const dislikeObject = {
            swipeAction: 'left',
            swipedBy: firebase.auth().currentUser.uid,
            swipedOnName: currentName,
            active: true,
            swipedOn: currentStock,
            time: getTime(),
        }
        navigation.pop()
        await firebase.functions().httpsCallable('addSwipeItem')(dislikeObject)
        
    }

    const handleLike = async () => {
        const likeObject = {
            swipeAction: 'right',
            swipedBy: firebase.auth().currentUser.uid,
            swipedOn: currentStock,
            active: true,
            swipedOnName: currentName,
            time: getTime(),
        };
        navigation.pop()
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
    const [currentName, setCurrentName] = useState(route.params.item.stockName)
    const [currentStock, setCurrentStock] = useState(route.params.item.stockSymbol)
    return (
        <Container>
            <RenderCard title = { route.params.item.stockName } symbol = { route.params.item.stockSymbol }/>
            <Container style = {{ flexDirection: 'row', alignSelf: 'center' }}>
                <Button onPress = { handleDislike } danger style = {{ marginRight: 20, }}><Text>Dislike</Text></Button><Button onPress = { handleLike } success><Text>Like</Text></Button>
            </Container>
        </Container>
    )
}
