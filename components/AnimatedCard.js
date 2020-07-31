import React, { useState, useEffect } from 'react';
import { Body, Text, Card, CardItem, Right } from 'native-base';
import { Animated, View, Easing } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
import Entypo from 'react-native-vector-icons/Entypo'
import IconAwesome from 'react-native-vector-icons/FontAwesome'
import firebase from 'firebase'
const axios = require('axios')
export default function App({handleExit, inList, handleAdd, handleRemove, item}) {
    const [position, setPosition] = useState(new Animated.ValueXY())
    const [iconColor, setIconColor] = useState("")
    const [iconName, setIconName] = useState("")
    const [selectable, setSelectable] = useState(true)
    const handleExitPress = (item) => {
        Animated.timing(position, {toValue: { x: 700, y: 0}, duration: 200, useNativeDriver: true}).start(() => {
            handleExit(item)
            handleRemove(item)
        }) 
    }

    const [textColor, setTextColor] = useState('black')
    const [price, setPrice] = useState(0)
    const [data, setData] = useState({
        textColor: 'black',
        selected: false,
    })
    const handlePress = () => {
        if(selectable) {
            if(data.selected) {
                handleRemove(item)
                setData({
                    textColor: 'black',
                    selected: false
                })

            } else {
                handleAdd(item)
                setData({
                    selected: true,
                    textColor: 'rgb(0, 122, 255)'
                })
            }
        }
    }



    useEffect(() => {
        if(item.swipeAction === 'right') {
            setIconColor("green")
            setIconName("long-arrow-up")
        } else {
            setIconColor("red")
            setIconName("long-arrow-down")
        }
        firebase.firestore().collection('response').doc(firebase.auth().currentUser.uid).get()
        .then(doc => {
            const options = {
                headers: {
                    'Authorization': doc.data().token_type + " " + doc.data().access_token,
                }
            }
            const url = "https://paper-api.alpaca.markets/v2/assets/" + item.swipedOn
            axios.get(url, options)
            .then(result => {
                if(item.swipeAction === 'left' && result.data.easy_to_borrow === false) {
                    setSelectable(false)
                }
            })
        })
    }, [])
    
    
    const AnimatedTouchable = Animated.createAnimatedComponent(TouchableWithoutFeedback)
    return (
    <Animated.View style = {{useNativeDriver: true, transform: position.getTranslateTransform()}}>
        <Card style = {selectable ? {opacity: 1} : {opacity: 0.3}}>
            <CardItem>
                
                    <Body>
                        <AnimatedTouchable onPress = { handlePress }>
                            <View style = {{ flexDirection: 'row', alignItems: 'center' }}>
                                <IconAwesome size = { 30 } name = { iconName } color = { iconColor } style = {{ marginRight: 12 }} />
                                <Text style = {{color: data.textColor}}>{ item.swipedOnName } ({ item.swipedOn })</Text>
                            </View>
                        </AnimatedTouchable>
                    </Body>
                
                <Right style = {{justifyContent: 'center'}}>
                    <AnimatedTouchable onPress = { () => handleExitPress(item) }>
                        <Entypo size = {30} name = 'cross' />
                    </AnimatedTouchable>
                </Right>
            </CardItem>
        </Card>
    </Animated.View>
    )
}