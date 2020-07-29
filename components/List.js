import React, {useState, useEffect} from 'react';
import { Container, Spinner } from 'native-base';
import { StyleSheet, FlatList } from 'react-native';
import StockItem from './StockItem';
import firebase from 'firebase';
require('firebase/firestore');
export default function App(props) {
    const collection = firebase.firestore().collection("swipes");
    const query = collection.where("swipedBy", "==", firebase.auth().currentUser.uid).orderBy("time", "desc").limit(18);
    const [companies, setCompanies] = useState([]);
    
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        query.onSnapshot(querySnapshot => {
            const list = [];
            querySnapshot.forEach(doc => {
                list.push({
                    swipedOn: doc.get('swipedOn'),
                    swipeAction: doc.get('swipeAction'),
                });
            })
            setCompanies(list);
            setLoading(false);
        });
    }, []);
    return (
        !loading ?
        <Container>
            <FlatList
            windowSize = { 10 }
            showsHorizontalScrollIndicator = { false }
            showsVerticalScrollIndicator = { false }
            data = { companies }
            renderItem = { ({item}) => {
            return <StockItem addToList = { (stockTitle, swipeAction) => props.addToList(stockTitle, swipeAction) } removeFromList = { props.removeFromList } item = { item } />
            }
            }
            />
        </Container>
        :
        <Container style = { styles.spinner }>
            <Spinner color = 'blue' />
        </Container>
    );
}

const styles = StyleSheet.create({
    spinner: {
        justifyContent: 'center',
    },
});