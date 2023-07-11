import {StyleSheet, Text, View, TouchableOpacity, Button} from 'react-native';
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
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.replace('SignIn')}>
          <Text style={styles.buttonText}>SignIn</Text>
        </TouchableOpacity>

        {/* <TouchableOpacity
        style={styles.button}
          onPress={() => navigation.navigate('SendLoc', {email: email})}
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
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    width: '100%',
  },
  button: {
    backgroundColor: '#2B50D9',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignSelf: 'center',
    marginVertical: 30,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
