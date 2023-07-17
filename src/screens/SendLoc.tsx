import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Button,
  PermissionsAndroid,
  Platform,
  Alert,
  Image,
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
// import { useRoute } from '@react-navigation/native';
type SendLocProps = NativeStackScreenProps<RootStackParamList, 'SendLoc'>;

const SendLoc = ({navigation, route}: SendLocProps) => {
  // const route = useRoute();
  const [location, setLocation] = useState<GeolocationResponse | null>(null);
  const [watchId, setWatchId] = useState<number | null>(null);

  //const [email, setEmail] = useState<string | null | undefined>(null);

  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  
  // const email = route.params
  const emailid : any  = route.params?.emailid;
  console.log(emailid);

  // useEffect(() => {
  //   const subscriber = auth().onAuthStateChanged(user => {
  //     console.log('user', JSON.stringify(user));
  //     setUser(user);
  //   });


  //   // setEmail(email)
  //   //   console.log("Send Loc")
  //   //   console.log(email)


  //   return subscriber;
  // }, []);

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
        console.log(emailid);
        // --------check user 
         auth().onAuthStateChanged(user => {
          console.log('user', JSON.stringify(user));

          database()
            .ref("/locations/" + user?.uid)
            .set({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              timestamp: Date(),
              email: user?.email,
              name: user?.displayName,
            })

          setUser(user);
        });
        // if ( email != null ){
        //   database()
        //     .ref('/locations/' + email)
        //     .set({
        //       latitude: position.coords.latitude,
        //       longitude: position.coords.longitude,
        //       timestamp: Date(),
        //     })
        //     .then(() => console.log('Data set.'));

        // }

        // if (user) {
          // database()
          //   .ref("/locations/")
          //   .set({
          //     latitude: position.coords.latitude,
          //     longitude: position.coords.longitude,
          //     timestamp: Date(),
          //     email: emailid,
          //   })
          // }q
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
      delay: 5000,
      onLoop: true,
      taskId: 'taskid',
      onError: e => console.log(`Error logging:`, e),
    });
  }, [user]);

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
      {/* <View style={st}> */}
      <Image style={styles.image} source={require("../assets/7881.png")} />

        <Text style={styles.Heading}>Send Location</Text>
        {/* <Text> {emailid}</Text> */}
        <TouchableOpacity style={styles.button} onPress={StartTask}>
          <Text style={styles.buttonText}>START</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.stopButton]} onPress={stopTracking}>
          <Text style={styles.buttonText}>STOP</Text>
        </TouchableOpacity>
        {location && (
          <Text style={styles.locationText}>
            Latitude: {location.coords.latitude}, Longitude:
            {location.coords.longitude}
          </Text>
        )}
      {/* </View> */}
      {/* <View style={styles.ButtonContainer}> */}
        <TouchableOpacity style={styles.buttonSignout} onPress={signOut}>
          <Text style={styles.SignOutbuttonText}>SignOut</Text>
        </TouchableOpacity>
      {/* </View> */}
    </View>
  );
};

export default SendLoc;

const styles = StyleSheet.create({
  image:{
    height: 250,
    width: 350,
    alignSelf: 'center',
    opacity: 0.8,
  },
  Heading: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
    // textAlign: 'center',
    marginTop: 30,
    marginHorizontal: 20,
  },
  TopContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    // alignItems: 'center',
    backgroundColor: '#111',
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
    // alignSelf: 'center',
    marginHorizontal: 20,
    marginVertical: 20,
  },
  stopButton: {
    backgroundColor: '#D92B2B',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonSignout: {
    backgroundColor: '#2E2E2E',
    borderRadius: 30,
    paddingVertical: 9,
    paddingHorizontal: 24,
    alignSelf: 'center',
    marginVertical: 50,
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
