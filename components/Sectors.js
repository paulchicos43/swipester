import React, { useEffect } from 'react';
import { Container, Content } from 'native-base';
import { StyleSheet } from 'react-native';
import SectorCard from './SectorCard';
import AsyncStorage from '@react-native-community/async-storage';
var mixpanel = require('mixpanel-browser');

mixpanel.init("6d9151e0235a322d90be478a21cbb237");
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
    const handlePress = (title) => {
        navigation.push('SwipeScreen', {
            title: title,
        })
    }
    useEffect(() => {
        buildStorage()
    }, [])
    return (
        <Container>
            <Content>
                <SectorCard handlePress = { handlePress } title = 'Energy' />
                <SectorCard handlePress = { handlePress } title = 'Materials' />
                <SectorCard handlePress = { handlePress } title = 'Industrials' />
                <SectorCard handlePress = { handlePress } title = 'Consumer Discretionary' />
                <SectorCard handlePress = { handlePress } title = 'Consumer Staples' />
                <SectorCard handlePress = { handlePress } title = 'Health Care' />
                <SectorCard handlePress = { handlePress } title = 'Financials' />
                <SectorCard handlePress = { handlePress } title = 'Information Technology' />
                <SectorCard handlePress = { handlePress } title = 'Communication Services' />
                <SectorCard handlePress = { handlePress } title = 'Utilities' />
                <SectorCard handlePress = { handlePress } title = 'Real Estate' />
            </Content>
        </Container>
    );
}

const styles = StyleSheet.create({

});