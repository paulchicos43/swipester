import { WebView } from 'react-native-webview';
import React, {useState} from 'react';
import { Container, Header, Right, Text, Button } from 'native-base';
import firebase from 'firebase';
export default function App({ navigation }) {

    return (
        <Container>
            <Header>
                <Right>
                    <Button onPress = { () => navigation.navigate("Home") } transparent>
                        <Text>Done</Text>
                    </Button>
                </Right>
            </Header>
            <WebView 
            source = {{ uri: 'https://app.alpaca.markets/oauth/authorize?response_type=code&client_id=9d563410f5503d25b91f3b71a2830cc9&redirect_uri=https://us-central1-swipesta-2b989.cloudfunctions.net/redirectURI&state=' + firebase.auth().currentUser.uid + '&scope=account:write%20trading' }}
            />
        </Container>
    );
}