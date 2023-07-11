import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Button,
  PermissionsAndroid,
  Platform,
  Alert,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../App';
import database from '@react-native-firebase/database';
import Geolocation, {
  GeolocationResponse,
  GeolocationError,
} from '@react-native-community/geolocation';
import ReactNativeForegroundService from '@supersami/rn-foreground-service';
import auth, {FirebaseAuthTypes, firebase} from '@react-native-firebase/auth';
import Home from './Home';

type SendLocProps = NativeStackScreenProps<RootStackParamList, 'SendLoc'>;

const SendLoc = ({navigation, route}: SendLocProps) => {
  const [location, setLocation] = useState<GeolocationResponse | null>(null);
  const [watchId, setWatchId] = useState<number | null>(null);

  const [email, setEmail] = useState<string | null | undefined>(null);

  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(user => {
      console.log('user', JSON.stringify(user));
      setUser(user);
      
    });

    return subscriber;
  }, []);

  // useEffect(() => {
  //   const usr = firebase.auth().currentUser;
  //   if (usr) {

  //     setEmail(usr.email);
  //     console.log(email);
  //   }

  // }, [])

  const startTracking = () => {
    const id = Geolocation.watchPosition(
      (position: GeolocationResponse) => {
        setLocation(position);
        console.log(position);
        console.log('watching');
        database()
          .ref('/locations/3')
          .set({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            timestamp: Date(),
          })
          .then(() => console.log('Data set.'));
      },
      (error: GeolocationError) => {
        console.error('Error fetching location:', error);
      },
      {
        enableHighAccuracy: true,
        distanceFilter: 1,
        interval: 5000, // Update interval in milliseconds (e.g., 5000 for every 5 seconds)
        fastestInterval: 2000, // Fastest update interval in milliseconds
      },
    );
    setWatchId(id);
  };

  useEffect(() => {
    ReactNativeForegroundService.add_task(() => startTracking(), {
      delay: 1000,
      onLoop: true,
      taskId: 'taskid',
      onError: e => console.log(`Error logging:`, e),
    });
  }, []);

  const stopTracking = () => {
    if (watchId) {
      Geolocation.clearWatch(watchId);
      setWatchId(null);
    }
    console.log('stop');
    ReactNativeForegroundService.remove_task('taskid');
    stopTask();
  };

  const StartTask = () => {
    ReactNativeForegroundService.start({
      id: 1244,
      title: 'SafeAir Tracker',
      message: 'Your Location is being tracked',
      icon: 'ic_launcher',
      button: true,
      button2: true,
      buttonText: 'More Info',
      button2Text: 'Stop',
      buttonOnPress: 'cray',
      color: '#000000',
      visibility: 'public',
      importance: 'max',
    });
  };

  const stopTask = () => {
    ReactNativeForegroundService.stop();
  };

  const signOut = () => {
    Alert.alert(
      'Logout',
      'Are you sure? You want to logout?',
      [
        {
          text: 'Cancel',
          onPress: () => {
            return null;
          },
        },
        {
          text: 'Confirm',
          onPress: () => {
            auth()
              .signOut()
              .then(() => console.log('User signed out!'))
              .then(() => navigation.replace('SignIn'));
          },
        },
      ],
      {cancelable: false},
    );
  };

  return (
    <View style={styles.TopContainer}>
      <View>
        <Text style={styles.Heading}>Send Location</Text>
        <TouchableOpacity style={styles.button} onPress={StartTask}>
          <Text style={styles.buttonText}>START</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={stopTracking}>
          <Text style={styles.buttonText}>STOP</Text>
        </TouchableOpacity>
        {location && (
          <Text style={styles.locationText}>
            Latitude: {location.coords.latitude}, Longitude:
            {location.coords.longitude}
          </Text>
        )}
      </View>
      <View style={styles.ButtonContainer}>
        <TouchableOpacity style={styles.buttonSignout} onPress={signOut}>
          <Text style={styles.SignOutbuttonText}>SignOut</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SendLoc;

const styles = StyleSheet.create({
  Heading: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginTop: 30,
  },
  TopContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    width: '100%',
  },
  ButtonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#2B50D9',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignSelf: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonSignout: {
    backgroundColor: '#2E2E2E',
    borderRadius: 25,
    paddingVertical: 9,
    paddingHorizontal: 24,
    alignSelf: 'center',
    marginVertical: 10,
  },
  SignOutbuttonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '300',
    textAlign: 'center',
  },
  locationText: {
    fontSize: 16,
    textAlign: 'center',
  },
});
