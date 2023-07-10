import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../App';

type SignInProps = NativeStackScreenProps<RootStackParamList, 'SignIn'>;

const SignIn = ({navigation}: SignInProps) => {
  return (
    <View>
      <Text>SignIn</Text>
    </View>
  )
}

export default SignIn

const styles = StyleSheet.create({})