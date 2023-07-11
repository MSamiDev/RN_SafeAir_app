import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Button,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../App';
import database from '@react-native-firebase/database';
import {firebase} from '@react-native-firebase/database';
import Geolocation, {
  GeolocationResponse,
  GeolocationError,
} from '@react-native-community/geolocation';
import ReactNativeForegroundService from '@supersami/rn-foreground-service';

// import Geolocation, {
//   GeolocationResponse,
// } from '@react-native-community/geolocation';

const reference = firebase
  .app()
  .database(
    'https://safeair-b0c14-default-rtdb.asia-southeast1.firebasedatabase.app',
  )
  .ref('/locations/3');

//

type SendLocProps = NativeStackScreenProps<RootStackParamList, 'SendLoc'>;

// const requestLocationPermission = async () => {
//     try {
//       const granted = await PermissionsAndroid.request(
//         PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//         {
//           title: 'Geolocation Permission',
//           message: 'Can we access your location?',
//           buttonNeutral: 'Ask Me Later',
//           buttonNegative: 'Cancel',
//           buttonPositive: 'OK',
//         },
//       );
//       console.log('granted', granted);
//       if (granted === 'granted') {
//         console.log('You can use Geolocation');
//         return true;
//       } else {
//         console.log('You cannot use Geolocation');
//         return false;
//       }
//     } catch (err) {
//       return false;
//     }
//   };

const SendLoc = ({navigation}: SendLocProps) => {
  // const [location, setLocation] = useState({});
  // const [location, setLocation] = useState<GeolocationResponse | null>(null);
  // const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  const [location, setLocation] = useState<GeolocationResponse | null>(null);
  const [watchId, setWatchId] = useState<number | null>(null);

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

  // useEffect(() => {
  //   return () => {
  //     stopTracking(); // Stop observing location updates when the component unmounts
  //   };
  // }, []);
  // ------------------------------------------------
  // const [location, setLocation] = useState<Location | null>(null);

  // const startTracking = () => {
  //   BackgroundGeolocation.start(); // Start tracking location in the background

  //   BackgroundGeolocation.onLocation((location: Location) => {
  //     setLocation(location);
  //   });

  //   BackgroundGeolocation.onLocationError((error: Error) => {
  //     console.error('Error fetching location:', error);
  //   });
  // };

  // const stopTracking = () => {
  //   BackgroundGeolocation.stop(); // Stop tracking location in the background
  // };

  // useEffect(() => {
  //   BackgroundGeolocation.checkStatus((status: any) => {
  //     if (!status.isRunning) {
  //       startTracking();
  //     }
  //   });

  //   return () => {
  //     BackgroundGeolocation.removeAllListeners(); // Clean up event listeners when component unmounts
  //   };
  // }, []);

  // ------------------------------------------------

  // const startFetchingLocation = () => {
  //   const id = setInterval(fetchLocation, 30000); // Fetch location every 30 seconds
  //   setIntervalId(id);
  //   fetchLocation(); // Fetch location immediately
  // };

  // const fetchLocation = () => {
  //   Geolocation.getCurrentPosition(
  //     position => {
  //       setLocation(position);
  //       console.log(position);
  //       database()
  //         .ref('/locations/3')
  //         .set({
  //           latitude: position.coords.latitude,
  //           longitude: position.coords.longitude,
  //           timestamp: Date()
  //         })
  //         .then(() => console.log('Data set.'));
  //     },
  //     error => {
  //       console.error('Error fetching location:', error);
  //     },
  //   );
  // };

  // const stopFetchingLocation = () => {
  //   if (intervalId) {
  //     clearInterval(intervalId);
  //     setIntervalId(null);
  //   }
  // };

  // useEffect(() => {
  //   if (intervalId) {
  //     fetchLocation(); // Fetch location immediately on app start
  //   }
  // }, [intervalId]);

  // ------------------------------------------------

  //   const getLocation = () => {
  //     const result = requestLocationPermission();
  //     result.then(res => {
  //       console.log('res is:', res);
  //       if (res) {
  //         Geolocation.watchPosition(
  //           position => {
  //             console.log(position);
  //             setLocation(position);
  //           },
  //           error => {
  //             // See error code charts below.
  //             console.log(error.code, error.message);
  //             setLocation(false);
  //           },
  //           {enableHighAccuracy: true, distanceFilter: 10, interval: 1000},
  //         );
  //       }
  //     });
  //     console.log(location);
  //   };

  useEffect(() => {
    ReactNativeForegroundService.add_task( () => startTracking(), {
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
    });
  };

  const stopTask = () => {
    ReactNativeForegroundService.stop();
  };


  return (
    <View style={styles.ButtonContainer}>
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
  ButtonContainer: {
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
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  locationText: {
    fontSize: 16,
    textAlign: 'center',
  },
});
