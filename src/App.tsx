/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useState, useEffect} from 'react';
import type {PropsWithChildren} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  SafeAreaView,
  ScrollView,
  useColorScheme,
  TouchableOpacity,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {
  NativeStackScreenProps,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import SignIn from './screens/SignIn';
import Home from './screens/Home';
import SendLoc from './screens/SendLoc';

export type RootStackParamList = {
  Home: undefined;
  SignIn: undefined;
  SendLoc: {email: string};
};
type SendLocProps = NativeStackScreenProps<RootStackParamList, 'SendLoc'>;

// import firebase from 'firebase';
const Stack = createNativeStackNavigator<RootStackParamList>();

function App({navigation}: SendLocProps): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} options={{title: 'Home'}} />
        <Stack.Screen
          name="SignIn"
          component={SignIn}
          options={{title: 'SignIn'}}
        />
        <Stack.Screen
          name="SendLoc"
          component={SendLoc}
          options={{title: 'Send Location'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({});

export default App;
