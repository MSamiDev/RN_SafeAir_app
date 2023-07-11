import {
  StyleSheet,
  Text,
  View,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../App';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SendLoc from './SendLoc';
import Home from './Home';
import SizedBox from '../components/SizedBox';

type SignInProps = NativeStackScreenProps<RootStackParamList, 'SignIn'>;

const Stack = createNativeStackNavigator<RootStackParamList>();

const SignIn = ({navigation}: SignInProps) => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Handle user state changes
  function onAuthStateChanged(user: FirebaseAuthTypes.User | null) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  useEffect(() => {
    if (user) {
      () => navigation.replace('SendLoc', {email: email});
    }
  }, []);

  const login = () => {
    auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        console.log('User account created & signed in!');
      })
      .then(() => {
        navigation.replace('SendLoc', {email: email});
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          console.log('That email address is already in use!');
        }

        if (error.code === 'auth/invalid-email') {
          console.log('That email address is invalid!');
        }

        console.error(error);
      });
  };

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safeAreaView}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.content}>
          <Text style={styles.title}>Welcome back!</Text>

          <SizedBox height={8} />

          <Text style={styles.subtitle}>Sign in to your account</Text>

          <SizedBox height={32} />

          <Pressable>
            <View style={styles.form}>
              <Text style={styles.label}>Email</Text>

              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                returnKeyType="next"
                style={styles.textInput}
                textContentType="username"
                onChange={e => {
                  setEmail(e.nativeEvent.text);
                }}
              />
            </View>
          </Pressable>

          <SizedBox height={16} />

          <Pressable>
            <View style={styles.form}>
              <Text style={styles.label}>Password</Text>

              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="done"
                secureTextEntry
                style={styles.textInput}
                textContentType="password"
                onChange={e => {
                  setPassword(e.nativeEvent.text);
                }}
              />
            </View>
          </Pressable>

          <SizedBox height={16} />

          {/* <View style={styles.forgotPasswordContainer}>
            <Text style={styles.textButton}>Forgot password?</Text>
          </View> */}

          <SizedBox height={16} />

          <TouchableOpacity onPress={login}>
            <View style={styles.button}>
              <Text style={styles.buttonTitle}>Continue</Text>
            </View>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: '#2B50D9',
    borderRadius: 8,
    height: 48,
    justifyContent: 'center',
  },
  buttonTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
    lineHeight: 22,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 32,
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
  },
  form: {
    alignItems: 'center',
    backgroundColor: 'rgb(58, 58, 60)',
    borderRadius: 8,
    flexDirection: 'row',
    height: 48,
    paddingHorizontal: 16,
  },
  label: {
    color: 'rgba(235, 235, 245, 0.6)',
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 20,
    width: 80,
  },
  root: {
    backgroundColor: '#ffffff',
    flex: 1,
  },
  safeAreaView: {
    flex: 1,
  },
  subtitle: {
    color: '#2D2F2F',
    fontSize: 17,
    fontWeight: '400',
    lineHeight: 22,
  },
  textButton: {
    color: '#0D0D0D',
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 20,
  },
  textInput: {
    color: '#FFFFFF',
    flex: 1,
  },
  title: {
    color: '#0D0D0D',
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 34,
  },
});
