import React, { useState, useEffect } from 'react';
import { Container, Content, Title, Spinner, Body, Card, CardItem, Text, ListItem, Segment, Button } from 'native-base';
import { StyleSheet, Dimensions, FlatList } from 'react-native';
import { LineChart } from 'react-native-chart-kit'
import firebase from 'firebase'
const axios = require('axios');

export default function App(props) {
    // const [price, setPrice] = useState(0)
    // const [enterpriseValue, setEnterpriseValue] = useState(0);
    // const [netDebt, setNetDebt] = useState(0);
    // const [EBITDA, setEBITDA] = useState(0);
    // const [PE, setPE] = useState(0);
    // const [volatility, setVolatility] = useState(0);
    // const [buys, setBuys] = useState(0);
    // const [holds, setHolds] = useState(0);
    // const [sells, setSells] = useState(0);
    // const [sales, setSales] = useState(0);
    // const [eps, setEps] = useState(0);
    const [loading, setLoading] = useState(true);
    const [oneDayData, setOneDayData] = useState(null)
    const [fiveDayData, setFiveDayData] = useState(null)
    const [sixMonthData, setSixMonthData] = useState(null)
    const [data, setData] = useState({
        price: 0,
        enterpriseValue: 0,
        netDebt: 0,
        EBITDA: 0,
        PE: 0,
        volatility: 0,
        buys: 0,
        holds: 0,
        sells: 0,
        sales: 0,
        eps: 0,
        chart: {},
    })
    const [chartData, setChartData] = useState([])
    const batchRequest = async () => {
        
        setActive(2)
        const result = await axios.get('https://sandbox.iexapis.com/stable/stock/' + props.symbol + '/batch?types=quote&token=Tsk_47aba52e64214057b138bb7b57e751f7')
        const price = result.data.quote.latestPrice
        const changePercent = result.data.quote.changePercent
        const chartData = await axios.get('https://sandbox.iexapis.com/stable/stock/' + props.symbol + '/batch?types=intraday-prices,chart&range=6m&token=Tsk_47aba52e64214057b138bb7b57e751f7')
        const fiveDay = await axios.get('https://sandbox.iexapis.com/stable/stock/' + props.symbol + '/chart/1m?token=Tsk_47aba52e64214057b138bb7b57e751f7')
        let sixMonthPrices = []
        let fiveDayPrices = []
        let oneDayPrices = []
        for(let thing of chartData.data.chart) {
            sixMonthPrices.push(thing.close)
        }
        for(let thing of fiveDay.data) {
            fiveDayPrices.push(thing.close)
        }
        let index = 0
        for(let thing of chartData.data['intraday-prices']) {
            if(thing.close != null && index % 10 === 0){
                oneDayPrices.push(thing.close)   
            }
            index += 1
        }
        setOneDayData(oneDayPrices)
        setFiveDayData(fiveDayPrices)
        setSixMonthData(sixMonthPrices)
        const cacheStats = await firebase.functions().httpsCallable("getCache")({symbol: props.symbol})
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
        setChartData(sixMonthPrices)
        setData({
            price: price,
            changePercent: changePercent,
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
        return
        
    }
    const [news, setNews] = useState([])
    const getNews = async () => {
        const result = await axios.get('https://sandbox.iexapis.com/stable/stock/'+ props.symbol +'/news?token=Tpk_d5ea729178384954bb5301abc99328fa')
        let test = []
        for(let res of result.data) {
            test.push(res)
        }
        setNews(test)
        return
    }

    const getHoldings = async () => {
        firebase.functions().httpsCallable("getHoldingNumber")({ searchStock: props.symbol })
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
        setLoading(true)
        getPeerData()
        const effectFunction = async () => {
            await batchRequest()
            await getNews()
            await getHoldings()
            
        }
        effectFunction()
        .then(() => setLoading(false))
    }, [props.symbol])
    const [active, setActive] = useState(2)
    const handleSegmentPress = (active) => {
        setActive(active)
        if(active === 0) {
            setChartData(oneDayData)
        } else if (active === 1) {
            setChartData(fiveDayData)
        } else if (active === 2) {
            setChartData(sixMonthData)
        }
    }
    const [peerData, setPeerData] = useState({})
    const getPeerData = async () => {
        const peerData = await firebase.functions().httpsCallable('getPeerData')({
            symbol: props.symbol
        })
        setPeerData(peerData.data)
    }
    return (
        !loading ?
        <Card style={{ elevation: 3 }}>
            <CardItem style = {{height: 650 }}>
                
                <Body>
                    <Content>
                    <Title style = { styles.title } >{ props.title }</Title>
                    <Title>Current Holdings: { holdings } ($ { holdings * data.price })</Title>
                    <Body>
                        
                        <Text style = { styles.subtitle } >$ { data.price } ({ (data.changePercent * 100).toFixed(2) } %)</Text>
                        <LineChart
                            withDots = {false}
                            withInnerLines = { false }
                            data={{
                            datasets: [
                                {
                                data: chartData
                                }
                            ]
                            }}
                            width={Dimensions.get("window").width - 20} // from react-native
                            height={220}
                            yAxisLabel="$"
                            yAxisInterval={1000} // optional, defaults to 1
                            chartConfig={{
                            backgroundColor: "#e26a00",
                            backgroundGradientFrom: "#fb8c00",
                            backgroundGradientTo: "#ffa726",
                            decimalPlaces: 2, // optional, defaults to 2dp
                            color: (opacity = 1) => `rgba(255, 255, 255, 0.6)`,
                            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                            style: {
                                borderRadius: 8
                            },
                            }}
                            style={{
                            marginVertical: 8,
                            borderRadius: 16
                            }}
                        />
                        <Segment>
                            <Button first active = { active === 2 } onPress = { () => handleSegmentPress(2) }>
                                <Text>6 Month</Text>
                            </Button>
                            <Button active = { active === 1 } onPress = { () => handleSegmentPress(1) }>
                                <Text>1 Month</Text>
                            </Button>
                            <Button last active = { active === 0 } onPress = { () => handleSegmentPress(0) }>
                                <Text>1 Day</Text>
                            </Button>
                        </Segment>
                        <Title>Valuation</Title>
                    <Text>EV/EBITDA: { data.EVEBITDA.toFixed(1) }x (higher than { peerData.higherThanEVEBITDA } peers)</Text>
                    <Text>P/E: { data.PE.toFixed(1) }x (higher than { peerData.higherThanPE } peers)</Text>
                    <Title>Growth</Title>
                    <Text>Sales Growth: { (data.salesGrowth * 100).toFixed(1) }% (higher than { peerData.higherThanSalesGrowth } peers)</Text>
                    <Text>EPS Growth: { (data.epsGrowth * 100).toFixed(1) }% (higher than { peerData.higherThanEPSGrowth } peers)</Text>
                    <Title>Debt</Title>
                    <Text>Net Debt/EBITDA: { (data.netDebtEBITDA * 100).toFixed(1) }x (higher than { peerData.higherThanNetDebtEBITDA } peers)</Text>
                    <Title>Risk</Title>
                    <Text>Volatility: { (data.volatility * 100).toFixed(1) } % (higher than { peerData.higherThanVolatility } peers)</Text>
                    <Title>Ratings</Title>
                    <Text>Buys/Sells/Holds: { data.buys }/{ data.holds }/{ data.sells }</Text>
                    <Text>Rating Score: { data.ratingScore.toFixed(2) } (higher than { peerData.higherThanRatingScore } peers)</Text>
                    <Text>Controversy Score: { ((1 - (Math.pow(data.buys / (data.buys + data.sells + data.holds), 2) + Math.pow(data.sells / (data.buys + data.sells + data.holds),2) + Math.pow(data.holds / (data.buys + data.sells + data.holds), 2))) / (2/3) * 100).toFixed(0) }%</Text>
                    <Title>Expectations</Title>
                    <Text>Next Quarter EPS: { data.consensusEPS1 } (higher than { peerData.higherThanNextQuarterEPS } peers)</Text>
                    <Text>Current Year Fiscal EPS: { data.consensusEPS2 } (higher than { peerData.higherThanCurrentYearEPS } peers)</Text>
                    <Text>Price Target: ${ data.priceTarget } ({ (((data.priceTarget - data.price)/ data.price) * 100).toFixed(2) }%) (higher than { peerData.higherThanPriceTarget } peers)</Text>
                        <Title>News</Title>
                        <FlatList 
                        data = {news}
                        renderItem = {({item}) => (
                            <ListItem style = {{ flexDirection: 'column' }}>
                                <Text style = {{ alignSelf: 'flex-start', fontWeight: '700', marginBottom: 10, }}>{ item.headline.trim() }</Text>
                                <Text>{ item.summary.trim() }</Text>
                            </ListItem>
                        )}/>
                    </Body>
                    </Content>
                </Body>
                
            </CardItem>
        </Card>
        :
        <Card style={{ elevation: 3, }}>
            <CardItem style = {{height: 650,}}>
                <Body>
                <Container style = {{ alignSelf: 'center', justifyContent: 'center' }}>
                    <Spinner color = 'red' />
                </Container>
                </Body>
            </CardItem>
        </Card>

    )
}

const styles = StyleSheet.create({
    spinner: {
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        alignSelf: 'center',
    },
    subtitle: {
        fontSize: 30,
    }
});