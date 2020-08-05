import React, { useState, useEffect } from 'react';
import { Body, Text, Card, CardItem, Right } from 'native-base';
import { Animated, View } from 'react-native';
import CartItem from '../components/CartItem'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
import Entypo from 'react-native-vector-icons/Entypo'
import IconAwesome from 'react-native-vector-icons/FontAwesome'
import firebase from 'firebase'
const axios = require('axios')
export default function App({prices, handleExit, selected, handleAdd, handleRemove, item}) {
    const [position, setPosition] = useState(new Animated.ValueXY())
    const [iconColor, setIconColor] = useState("")
    const [iconName, setIconName] = useState("")
    const handleExitPress = (item) => {
        Animated.timing(position, {toValue: { x: 700, y: 0}, duration: 200, useNativeDriver: true}).start(() => {
            handleExit(item)
            handleRemove(item)
        }) 
    }
    const [price, setPrice] = useState(0)
    const [data, setData] = useState({
        textColor: 'black',
        selected: false,
    })
    const handlePress = () => {
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

    useEffect(() => {
        if(item.swipeAction === 'right') {
            setIconColor("green")
            setIconName("long-arrow-up")
        } else {
            setIconColor("red")
            setIconName("long-arrow-down")
        }
        
     }, [])
    useEffect(() => {
        
        if(typeof prices[item.swipedOn] !== 'undefined') {
            setPrice(prices[item.swipedOn].price)
        }
    }, [prices])
    

    const propogate = (title, value) => {
        for(var i = 0; i < selected.length; i++) {
            if(selected[i].swipedOn === title) {
                selected[i].shares = Math.floor(value);
            }
        }
    }
    
    const AnimatedTouchable = Animated.createAnimatedComponent(TouchableWithoutFeedback)
    return (
        !data.selected ? <Animated.View style = {{useNativeDriver: true, transform: position.getTranslateTransform()}}>
            <Card>
                <CardItem>
                    
                        <Body>
                            <AnimatedTouchable onPress = { handlePress }>
                                <View style = {{ flexDirection: 'row', alignItems: 'center'}}>
                                    <IconAwesome size = { 30 } name = { iconName } color = { iconColor } style = {{ marginRight: 12 }} />
                                    <View>
                                        <Text style = {{color: data.textColor}}>{ item.swipedOnName } ({ item.swipedOn })</Text>
                                        <Text>$ { price }</Text>
                                    </View>
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
        :
        <Animated.View style = {{useNativeDriver: true, transform: position.getTranslateTransform()}}>
            <Card>
                <CardItem>
                    
                        <Body>
                            <AnimatedTouchable onPress = { handlePress }>
                                <View style = {{ flexDirection: 'row', alignItems: 'center'}}>
                                    <IconAwesome size = { 30 } name = { iconName } color = { iconColor } style = {{ marginRight: 12 }} />
                                    <View>
                                        <Text style = {{color: data.textColor}}>{ item.swipedOnName } ({ item.swipedOn })</Text>
                                        <Text>$ { price }</Text>
                                    </View>
                                </View>
                            </AnimatedTouchable>
                        </Body>
                    
                    <Right style = {{justifyContent: 'center'}}>
                        <AnimatedTouchable onPress = { () => handleExitPress(item) }>
                            <Entypo size = {30} name = 'cross' />
                        </AnimatedTouchable>
                    </Right>
                </CardItem>
                <CardItem>
                    <CartItem price = { price } propogate = { propogate } fullTitle = { item.swipedOnName } title = { item.swipedOn } />
                </CardItem>
            </Card>
        </Animated.View>

    )
}


