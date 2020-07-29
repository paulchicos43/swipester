import React, { useState, useEffect } from 'react';
import { Container, Header, Body, Title, Right, Button, Icon, Left } from 'native-base';
import { StyleSheet, YellowBox } from 'react-native';
import List from './List';

export default function App({ navigation }) {
    const [seg, setSeg] = useState("right");
    var selected = []

    const addToList = (stockTitle, swipe) => {
        selected.push({
            title: stockTitle,
            swipeAction: swipe,
            shares: 0,
        });
        return;
    }

    const removeFromList = (stockTitle) => {
        var newArray = [];
        for(var i = 0; i < selected.length; i++) {
            if(selected[i]['title'] !== stockTitle) {
                newArray.push(selected[i]);
            }
        }
        selected = newArray
        
        return;
    }
    useEffect(() => {
        YellowBox.ignoreWarnings(["VirtualizedList: missing keys for items, make sure to specify a key or id property on each item or provide a custom keyExtractor."]);
    });
    return (
        <Container>
            <Header>
                <Left>
                    <Button onPress = { () => navigation.navigate('Home') } transparent>
                        <Icon name = "arrow-back" />
                    </Button>
                </Left>
                <Body>
                    <Title>Review</Title>
                    {/* <Segment>
                        <Button first onPress = { () => setSeg("right") } active = { seg === "right" ? true : false }><Text>Longs</Text></Button>
                        <Button last onPress = { () => setSeg("left") } active = { seg === "left" ? true : false }><Text>Shorts</Text></Button>
                    </Segment> */}
                </Body>
                <Right>
                    <Button onPress = { () => navigation.navigate("Cart", {
                        selected: selected,
                    }) } transparent>
                        <Icon name = 'arrow-forward' />
                    </Button>
                </Right>
            </Header>
            <List addToList = { (stockTitle, swipeAction) => addToList(stockTitle, swipeAction) } removeFromList = { removeFromList } />
        </Container>
    );
}

const styles = StyleSheet.create({

});