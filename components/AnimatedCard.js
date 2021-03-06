import React, { useState, useEffect } from 'react';
import { Body, Text, Card, CardItem, Right, Title } from 'native-base';
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
    useEffect(() => {
        handleAdd(item)
    }, [])
    const handlePress = () => {
            if(data.selected) {
                
                setData({
                    textColor: 'black',
                    selected: false
                })

            } else {
                setData({
                    selected: true,
                    textColor: 'rgb(0, 122, 255)'
                })
            }
    }
    const getHoldings = async () => {
        firebase.functions().httpsCallable("getHoldingNumber")({ searchStock: item.swipedOn })
        .then(result => {
            setHoldings(result.data)
            return
        })
        .catch(() => {
            setHoldings(0)
            return
        })

    }
    const [holdings, setHoldings] = useState(0)
    useEffect(() => {
        if(item.swipeAction === 'right') {
            setIconColor("green")
            setIconName("long-arrow-up")
        } else {
            setIconColor("red")
            setIconName("long-arrow-down")
        }
        getHoldings()
     }, [])
    useEffect(() => {
        
        if(typeof prices[item.swipedOn] !== 'undefined') {
            setPrice(prices[item.swipedOn].price)
        }
    }, [prices])
    
    const [sliderVal, setSliderVal] = useState(0)

    const propogate = (title, value) => {
        setSliderVal(value)
        for(var i = 0; i < selected.length; i++) {
            if(selected[i].swipedOn === title) {
                selected[i].shares = Math.floor(value);
            }
        }
    }
    
    const AnimatedTouchable = Animated.createAnimatedComponent(TouchableWithoutFeedback)
    const [tickerData, setTickerData] = useState({})
    useEffect(() => {
        const getTickerData = async () => {
            const cacheStats = await firebase.functions().httpsCallable("getCache")({symbol: item.swipedOn})
            let EVEBITDA = cacheStats.data.EVEBITDA
            let PE = cacheStats.data.PE
            let salesGrowth = cacheStats.data.salesGrowth
            let epsGrowth = cacheStats.data.epsGrowth
            let netDebtEBITDA = cacheStats.data.netDebtEBITDA
            let volatility = cacheStats.data.volatility
            let ratingScore = cacheStats.data.ratingScore
            let buys = cacheStats.data.buys
            let holds = cacheStats.data.holds
            let sells = cacheStats.data.sells
            let consensusEPS1 = cacheStats.data.consensusEPS1
            let consensusEPS2 = cacheStats.data.consensusEPS2
            let priceTarget = cacheStats.data.priceTarget
            setTickerData({
                price: price,
                EVEBITDA: EVEBITDA,
                PE: PE,
                salesGrowth: salesGrowth,
                epsGrowth: epsGrowth,
                netDebtEBITDA: netDebtEBITDA,
                volatility: volatility,
                ratingScore: ratingScore,
                buys: buys,
                holds: holds,
                sells: sells,
                consensusEPS1: consensusEPS1,
                consensusEPS2: consensusEPS2,
                priceTarget: priceTarget,

            })
        }
        getTickerData()
        getPeerData()
    }, [])
    const [peerData, setPeerData] = useState({})
    const getPeerData = async () => {
        const peerData = await firebase.functions().httpsCallable('getPeerData')({
            symbol: item.swipedOn
        })
        setPeerData(peerData.data)
    }
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
                <CardItem>
                        <CartItem starter = { sliderVal } price = { price } propogate = { propogate } fullTitle = { item.swipedOnName } title = { item.swipedOn } />
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
                <Title>Holdings: { holdings } ($ { holdings * price })</Title>
                <CardItem>
                        <CartItem starter = { sliderVal } price = { price } propogate = { propogate } fullTitle = { item.swipedOnName } title = { item.swipedOn } />
                </CardItem>
                <CardItem style = {{ flexDirection: 'column' }}>
                    <Title>Valuation</Title>
                    <Text>EV/EBITDA: { tickerData.EVEBITDA.toFixed(1) }x (higher than { peerData.higherThanEVEBITDA } peers)</Text>
                    <Text>P/E: { tickerData.PE.toFixed(1) }x (higher than { peerData.higherThanPE } peers)</Text>
                    <Title>Growth</Title>
                    <Text>Sales Growth: { (tickerData.salesGrowth * 100).toFixed(1) }% (higher than { peerData.higherThanSalesGrowth } peers)</Text>
                    <Text>EPS Growth: { (tickerData.epsGrowth * 100).toFixed(1) }% (higher than { peerData.higherThanEPSGrowth } peers)</Text>
                    <Title>Debt</Title>
                    <Text>Net Debt/EBITDA: { (tickerData.netDebtEBITDA * 100).toFixed(1) }x (higher than { peerData.higherThanNetDebtEBITDA } peers)</Text>
                    <Title>Risk</Title>
                    <Text>Volatility: { (tickerData.volatility * 100).toFixed(1) } % (higher than { peerData.higherThanVolatility } peers)</Text>
                    <Title>Ratings</Title>
                    <Text>Buys/Sells/Holds: { tickerData.buys }/{ tickerData.holds }/{ tickerData.sells }</Text>
                    <Text>Rating Score: { tickerData.ratingScore.toFixed(2) } (higher than { peerData.higherThanRatingScore } peers)</Text>
                    <Text>Controversy Score: { ((1 - (Math.pow(tickerData.buys / (tickerData.buys + tickerData.sells + tickerData.holds), 2) + Math.pow(tickerData.sells / (tickerData.buys + tickerData.sells + tickerData.holds),2) + Math.pow(tickerData.holds / (tickerData.buys + tickerData.sells + tickerData.holds), 2))) / (2/3) * 100).toFixed(0) }%</Text>
                    <Title>Expectations</Title>
                    <Text>Next Quarter EPS: { tickerData.consensusEPS1 } (higher than { peerData.higherThanNextQuarterEPS } peers)</Text>
                    <Text>Current Year Fiscal EPS: { tickerData.consensusEPS2 } (higher than { peerData.higherThanCurrentYearEPS } peers)</Text>
                    <Text>Price Target: ${ tickerData.priceTarget } ({ (((tickerData.priceTarget - price)/ price) * 100).toFixed(2) }%) (higher than { peerData.higherThanPriceTarget } peers)</Text>
                </CardItem>
            </Card>
        </Animated.View>

    )
}


