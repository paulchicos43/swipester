import React, { useState, useEffect } from 'react';
import { Container, Content, Title, Spinner, Body, Card, CardItem, Text, Left } from 'native-base';
import { StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit'
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
    const batchRequest = async () => {
        setTimeout(async () => {
        const result = await axios.get('https://sandbox.iexapis.com/stable/stock/' + props.symbol + '/batch?types=price,advanced-stats,news,financials,recommendation-trends,stats,income,chart&range=6m&token=Tsk_47aba52e64214057b138bb7b57e751f7')
        const price = result.data.price
        const EBITDA = result.data['advanced-stats'].EBITDA
        const enterpriseValue = result.data['advanced-stats'].enterpriseValue
        const PE = result.data['advanced-stats'].forwardPERatio
        const netDebt = result.data.financials.financials[0].shortTermDebt + result.data.financials.financials[0].longTermDebt + result.data.financials.financials[0].currentDebt - result.data.financials.financials[0].totalCash
        const sales = result.data.financials.financials[0].totalRevenue;
        const buys = result.data['recommendation-trends'][result.data['recommendation-trends'].length - 1].ratingBuy + result.data['recommendation-trends'][result.data['recommendation-trends'].length - 1].ratingOverweight
        const holds = result.data['recommendation-trends'][result.data['recommendation-trends'].length - 1].ratingHold
        const sells = result.data['recommendation-trends'][result.data['recommendation-trends'].length - 1].ratingSell + result.data['recommendation-trends'][result.data['recommendation-trends'].length - 1].ratingUnderweight
        const eps = result.data.stats.ttmEPS
        const chartData = result.data.chart
        var volatility
        var dates = new Set()
        var dataPoints = []
        for (var data of chartData) {
            dates.add(data.date.split('-')[1])
            dataPoints.push(data.close)
        }
        const indicator = await axios.get('https://sandbox.iexapis.com/stable/stock/' + props.symbol + '/indicator/volatility?range=ytd&token=Tpk_d5ea729178384954bb5301abc99328fa')
        volatility = indicator.data.indicator[0][indicator.data.indicator[0].length - 1]
        setData({
            price: price,
            enterpriseValue: enterpriseValue,
            netDebt: netDebt,
            EBITDA: EBITDA,
            PE: PE,
            buys: buys,
            sells: sells,
            holds: holds,
            sales: sales,
            eps: eps,
            dates: Array.from(dates).sort(),
            dataPoints: dataPoints,
            volatility: volatility
        })
        setLoading(false);
        }, 10)}

    useEffect(() => {
        batchRequest()
        
    }, [props.symbol])

    return (
        !loading ?
        <Card style={{ elevation: 3, }}>
            <CardItem style = {{height: 600,}}>
                
                <Body>
                    <Content>
                    <Title style = { styles.title } >{ props.title }</Title>
                    <Body>
                        
                        <Text style = { styles.subtitle } >$ { data.price }</Text>
                        <LineChart
                            withDots = {false}
                            withInnerLines = { false }
                            data={{
                            labels: data.dates,
                            datasets: [
                                {
                                data: data.dataPoints
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
                        <Title>Core Stats</Title>
                        <Text>Enterprise Value: { data.enterpriseValue }</Text>
                        <Text>Net Debt: { data.netDebt }</Text>
                        <Text>EBITDA { data.EBITDA }</Text>
                        <Text>PE: { data.PE }</Text>
                        <Text>Volatility: { data.volatility }</Text>
                        <Text>Buys: { data.buys }</Text>
                        <Text>Holds: { data.holds }</Text>
                        <Text>Sells: { data.sells }</Text>
                        <Text>Sales: { data.sales }</Text>
                        <Text>EPS: { data.eps }</Text>
                        <Title>News</Title>
                        
                    </Body>
                    </Content>
                </Body>
                
            </CardItem>
        </Card>
        :
        <Card style={{ elevation: 3, }}>
            <CardItem style = {{height: 600,}}>
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
        fontSize: 30,
        alignSelf: 'center',
    },
    subtitle: {
        fontSize: 30,
    }
});