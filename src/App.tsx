/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import * as React from 'react';
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
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SignIn from './screens/SignIn';
import Home from './screens/Home';
import SendLoc from './screens/SendLoc';

export type RootStackParamList = {
  Home: undefined;
  SignIn: undefined;
  SendLoc: undefined;
};

// import firebase from 'firebase';
const Stack = createNativeStackNavigator<RootStackParamList>();

function App({navigation}: any): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen
            name="Home"
            component={Home}
            options={{title: 'Home'}}
          />
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
    flex: 1,
    marginVertical: 200,
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    height: 40,
    backgroundColor: '#DF663E',
    color: '#fff',
    borderRadius: 7,
  },
  buttonText: {
    fontSize: 20,
  },
});

export default App;
