import React, {useState, useEffect} from 'react';
import { Container, Body, Text, ListItem, CheckBox, Spinner, ListView } from 'native-base';
import { StyleSheet, TouchableWithoutFeedback } from 'react-native';

export default function App(props) {
    const [checked, setChecked] = useState(false);

    const handlePress = () => {
        if(checked) {
            props.removeFromList(props.item.swipedOn);
        } else {
            props.addToList(props.item.swipedOn, props.item.swipeAction);
        }
        setChecked(!checked);
    }

    return (
        <TouchableWithoutFeedback onPress = { handlePress }>
            <ListItem style = { props.item.swipeAction === 'right' ? styles.green : styles.red}>
                <CheckBox onPress = { handlePress } checked = { checked } />
                <Body>
                    <Text>{ props.item.swipedOn }</Text>
                </Body>
            </ListItem>
        </TouchableWithoutFeedback>
    );
}
const styles = StyleSheet.create({
    green: {
        backgroundColor: 'rgba(41, 241, 195, 0.1)',
    },
    red: {
        backgroundColor: 'rgba(240, 52, 52, 0.1)',
    }
})