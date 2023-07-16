import {StyleSheet, Text, View, TouchableOpacity, Button, Image} from 'react-native';
import React, {useEffect, useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../App';
import auth, {FirebaseAuthTypes, firebase} from '@react-native-firebase/auth';

type HomeProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

const Home = ({navigation}: HomeProps) => {
  // Set an initializing state whilst Firebase connects
  useEffect(() => {
    const usr = firebase.auth().currentUser;
    if (usr) {
    }
  }, []);

  // if (initializing) return null;

  return (
    <View style={styles.mainContainer}>
      <View style={styles.container}>
       <Image style={styles.image} source={require("../assets/safeair.png")} />

        <Text style={styles.headingText}>Effortlessly Track Your Team in Real Time!</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.replace('SignIn')}>
          <Text style={styles.buttonText}>SignIn</Text>
        </TouchableOpacity>

        {/* <TouchableOpacity
        style={styles.button}
          onPress={() => navigation.navigate('SendLoc')}
        >
      <Text style={styles.buttonText}>Send Location</Text>

        </TouchableOpacity> */}
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: '#111',
  },
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    // alignItems: 'center',
    // backgroundColor: '#fff',
    width: '100%',
    paddingBottom: 70,
  },
  image: {
    alignSelf: 'center',
    marginBottom: 70,
    // marginLeft: 20,
height: 200,
width: 300,
  },
  headingText:{
    color: 'white',
    fontSize: 36,
    paddingHorizontal: 24,
    marginVertical: 30,
    fontFamily: 'sans-serif',
    fontWeight: 'thin',
  },
  button: {
    backgroundColor: '#2B50D9',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 24,
    // alignSelf: 'center',
    marginHorizontal: 30,
    marginVertical: 30,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
