import React, { useState } from 'react';
import { Card, CardItem, Body, Text } from 'native-base';
import { TouchableWithoutFeedback } from 'react-native';
import firebase from 'firebase';

export default function App(props) {
    return (
        <TouchableWithoutFeedback onPress = { () => props.handlePress(props.title) }>
            <Card>
                <CardItem>
                    <Body>
                        <Text>{ props.title }</Text>
                    </Body>
                </CardItem>
            </Card>
        </TouchableWithoutFeedback>
    );
}