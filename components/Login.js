import React, {useState, useEffect} from 'react';
import { Container, Form, Input, Item, Button, Text } from 'native-base';
import { StyleSheet } from 'react-native';
import firebase from 'firebase';
import * as Facebook from 'expo-facebook'
import * as Google from 'expo-google-app-auth';

const Facebooklogin = async () => {
  Facebook.initializeAsync('938605213303146', 'Swipester')
  const { type, token } = await
  Facebook.logInWithReadPermissionsAsync(
         "938605213303146",{
                permission: "public_profile"
      } 
  );
    const credential = firebase.auth.FacebookAuthProvider.credential(token);
  firebase.auth().signInWithCredential(credential)
  .catch(error => {
    console.log(error);
  });
}
const isUserEqual = (googleUser, firebaseUser) => {
  if (firebaseUser) {
    var providerData = firebaseUser.providerData;
    for (var i = 0; i < providerData.length; i++) {
      if (providerData[i].providerId === firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
          providerData[i].uid === googleUser.getBasicProfile().getId()) {
        // We don't need to reauth the Firebase connection.
        return true;
      }
    }
  }
  return false;
}
async function signInWithGoogleAsync() {
  try {
    const result = await Google.logInAsync({
      //androidClientId: YOUR_CLIENT_ID_HERE,
      behavior: 'web',
      iosClientId: '893175794684-1uc21hbhi57jes4k3u7s4vtfa1bjuj44.apps.googleusercontent.com',
      scopes: ['profile', 'email'],
    });

    if (result.type === 'success') {
      onSignIn(result);
      return result.accessToken;
    } else {
      return { cancelled: true };
    }
  } catch (e) {
    return { error: true };
  }
}
const onSignIn = (googleUser) => {
  // We need to register an Observer on Firebase Auth to make sure auth is initialized.
  var unsubscribe = firebase.auth().onAuthStateChanged(function(firebaseUser) {
    unsubscribe();
    // Check if we are already signed-in Firebase with the correct user.
    if (!isUserEqual(googleUser, firebaseUser)) {
      // Build Firebase credential with the Google ID token.
      var credential = firebase.auth.GoogleAuthProvider.credential(
          googleUser.idToken,
          googleUser.accessToken
          );
      // Sign in with credential from the Google user.
      firebase.auth().signInWithCredential(credential)
      .then(() => {
        console.log('Success');
      })
      .catch(function(error) {
        console.log(error);
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
      });
    } else {
      navigation.navigate('Home');
      console.log('User already signed-in Firebase.');
    }
  });
}

const firebaseConfig = { //Config info for firebase. Does not change.
    apiKey: "AIzaSyBkfZeAe5W3Z6Fd79vFQ1KFaazz59uoDPA",
    authDomain: "swipesta-2b989.firebaseapp.com",
    databaseURL: "https://swipesta-2b989.firebaseio.com",
    projectId: "swipesta-2b989",
    storageBucket: "swipesta-2b989.appspot.com",
    messagingSenderId: "893175794684",
    appId: "1:893175794684:web:e788d9af26b22f9e850079",
    measurementId: "G-5G72Q68SB4"
  };
  
if(firebase.apps.length === 0){ //Prevent initializing twice
    firebase.initializeApp(firebaseConfig);
}

export default function App({ navigation }) {
  
    const checkIfLoggedIn = () => {
      firebase.auth().onAuthStateChanged((user) => {
        if(user) {
          navigation.navigate("Home");
        } else {
          navigation.navigate("Login")
        }
      })
    }
    useEffect(() => checkIfLoggedIn());
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handlePress = () => {
      firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(() => {
        firebase.auth().currentUser.sendEmailVerification()
        alert("Confirmation email sent.")
      })
      .catch(error => {
        firebase.auth().signInWithEmailAndPassword(email, password)
        .catch(error => {
          alert(error)
        })
      })
    }
    return (
      <Container>
        <Form style = { styles.container }>
          <Item>
            <Input autoCapitalize = 'none' autoCorrect = { false } onChangeText = { value => setEmail(value) } placeholder = 'Username' />
          </Item>
          <Item>
            <Input autoCorrect = { false } secureTextEntry = { true } onChangeText = { value => setPassword(value) } placeholder = 'password' />
          </Item>
          <Button onPress = { handlePress } primary block><Text>Sign In/Register</Text></Button>
          <Button onPress = { () => {firebase.auth().sendPasswordResetEmail(email); alert("Email Sent")} } style = { styles.button } primary block><Text>Reset Password</Text></Button>
          <Button onPress = { () => signInWithGoogleAsync() } style = { styles.button } primary block><Text>Google Sign In</Text></Button>
          <Button onPress = { () => Facebooklogin() } style = { styles.button } primary block><Text>Facebook Sign In</Text></Button>
        </Form>
        
      </Container>
    );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 100,
    alignContent: 'center',
  },
  button: {
    marginTop: 10,
  }
});