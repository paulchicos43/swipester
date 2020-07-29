import React, { useState, useEffect } from 'react';
import { Container, Header, Body, Title, Right, Button, Icon, Left } from 'native-base';
import { StyleSheet, YellowBox } from 'react-native';
import List from './List';

export default function App({ route, navigation }) {
    const [seg, setSeg] = useState("right");
    const [selected, setSelected] = useState([])

    const addToList = (stockTitle, swipe) => {
        var newArray = selected
        newArray.push({
            title: stockTitle,
            swipeAction: swipe,
            shares: 0,
        });
        setSelected(newArray)
        navigation.setParams({
            selected: selected,
        })
        return;
    }

    const removeFromList = (stockTitle) => {
        var newArray = [];
        for(var i = 0; i < selected.length; i++) {
            if(selected[i]['title'] !== stockTitle) {
                newArray.push(selected[i]);
            }
        }
        setSelected(newArray)
        navigation.setParams({
            selected: selected,
        })
        return;
    }
    useEffect(() => {
        YellowBox.ignoreWarnings(["VirtualizedList: missing keys for items, make sure to specify a key or id property on each item or provide a custom keyExtractor."]);
    });
    return (
        <Container>
            <List addToList = { (stockTitle, swipeAction) => addToList(stockTitle, swipeAction) } removeFromList = { removeFromList } />
        </Container>
    );
}