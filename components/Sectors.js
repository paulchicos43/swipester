import React, { useState } from 'react';
import { Container, Content, Header, Title, Body, Left, Right, Icon, Button } from 'native-base';
import { StyleSheet } from 'react-native';
import SectorCard from './SectorCard';
import firebase from 'firebase';


export default function App({ navigation }) {
    const handlePress = (title) => {
        navigation.navigate('SwipeScreen', {
            title: title,
        })
    }
    return (
        <Container>
            <Header>
                <Left>
                    <Button onPress = { () => navigation.navigate("Home") } transparent>
                        <Icon name = 'arrow-back' />
                    </Button>
                </Left>
                <Body>
                    <Title>Sectors</Title>
                </Body>
                <Right>
                </Right>
            </Header>
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