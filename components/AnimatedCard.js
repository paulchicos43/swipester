import React, { useState, useEffect } from 'react';
import { Body, Text, Card, CardItem, Right } from 'native-base';
import { Animated, View } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
import Entypo from 'react-native-vector-icons/Entypo'
import IconAwesome from 'react-native-vector-icons/FontAwesome'
const axios = require('axios')
export default function App({handleExit, handleAdd, handleRemove, item}) {
    const [position, setPosition] = useState(new Animated.ValueXY())
    const [iconColor, setIconColor] = useState("")
    const [iconName, setIconName] = useState("")
    const handleExitPress = (item) => {
        Animated.timing(position, {toValue: { x: 420, y: 0}, duration: 100, useNativeDriver: false}).start(() => {
            handleRemove(item)
            setData({
                textColor: 'black',
                selected: false
            })
            handleExit(item)
            Animated.timing(position, {toValue: { x: 0, y: 0}, duration: 0, useNativeDriver: false}).start()
        }) 
    }

    const [textColor, setTextColor] = useState('black')
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
    const AnimatedTouchable = Animated.createAnimatedComponent(TouchableWithoutFeedback)
    return (
    <Animated.View style = {{useNativeDriver: true, transform: position.getTranslateTransform()}}>
        <Card>
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