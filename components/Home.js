import React, {useEffect} from 'react';
import { Container, Text, Button, Header, Title, Body, Content, Card } from 'native-base';
import { StyleSheet } from 'react-native';
import firebase from 'firebase';
import AsyncStorage from '@react-native-community/async-storage';
const resetStorage = async () => {
    await AsyncStorage.setItem('Energy', '0');
    await AsyncStorage.setItem('Materials', '0');
    await AsyncStorage.setItem('Industrials', '0');
    await AsyncStorage.setItem('Consumer Staples', '0');
    await AsyncStorage.setItem('Health Care', '0');
    await AsyncStorage.setItem('Financials', '0');
    await AsyncStorage.setItem('Information Technology', '0');
    await AsyncStorage.setItem('Communication Services', '0');
    await AsyncStorage.setItem('Utilities', '0');
    await AsyncStorage.setItem('Real Estate', '0');
}
const buildStorage = async () => {
    if(await AsyncStorage.getItem('Energy'))
        await AsyncStorage.setItem('Energy', '0')
    if(await AsyncStorage.getItem('Materials'))
        await AsyncStorage.setItem('Materials', '0')
    if(await AsyncStorage.getItem('Industrials'))
        await AsyncStorage.setItem('Industrials', '0')
    if(await AsyncStorage.getItem('Consumer Staples'))
        await AsyncStorage.setItem('Consumer Staples', '0')
    if(await AsyncStorage.getItem('Health Care'))
        await AsyncStorage.setItem('Health Care', '0')
    if(await AsyncStorage.getItem('Financials'))
        await AsyncStorage.setItem('Financials', '0')
    if(await AsyncStorage.getItem('Information Technology'))
        await AsyncStorage.setItem('Information Technology', '0')
    if(await AsyncStorage.getItem('Communication Services'))
        await AsyncStorage.setItem('Communication Services', '0')
    if(await AsyncStorage.getItem('Utilities'))
        await AsyncStorage.setItem('Utilities', '0')
    if(await AsyncStorage.getItem('Real Estate'))
        await AsyncStorage.setItem('Real Estate', '0');
}
export default function App({ navigation }) {
    useEffect(() => {
        buildStorage()
    }, [])
    return (
        <Container>
            <Header>
                <Body>
                    <Title>Home</Title>
                </Body>
            </Header>
            <Content>
                <Button style = { styles.button } onPress = { () => navigation.navigate("Sectors") } primary block>
                    <Text>Start Swiping</Text>
                </Button>
                <Button style = { styles.button } onPress = { () => navigation.navigate("Review") } primary block>
                    <Text>Review Swipes</Text>
                </Button>
                <Button style = { styles.button } onPress = { () => navigation.navigate("Alpaca") } primary block>
                    <Text>Link Alpaca</Text>
                </Button>
                <Button style = { styles.button } onPress = { () => {resetStorage(); alert("Success")} } primary block>
                    <Text>Reset Swipes</Text>
                </Button>
                <Button style = { styles.button } onPress = { () => firebase.auth().signOut() } primary block>
                    <Text>Log Out</Text>
                </Button>
                
            </Content>
        </Container>
    );
}

const styles = StyleSheet.create({
    title: {
        fontSize: 20,
    },
    button: {
        marginTop: 10,
    }
});