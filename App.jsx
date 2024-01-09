import React, { useState, useEffect } from 'react';
import { Button, Text, View, StyleSheet, TextInput, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from 'react-native';
// import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

import * as Location from 'expo-location';

import Speedometer, {
  Background,
  Arc,
  Needle,
  Progress,
  Marks,
  Indicator,
} from 'react-native-cool-speedometer';

// const adUnitId = __DEV__ ? TestIds.ADAPTIVE_BANNER : 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyyyyyy';

export default function App() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const [currentSpeed, setCurrentSpeed] = useState(0)
  const [maxSpeed, setMaxSpeed] = useState("0")
  const [distanceTravelled, setDisatanceTravelled] = useState("0")
  const [remainingDistance, setRemainingDistance] = useState("0")
  const [distance, setDistance] = useState(100000)
  const [speedLimit, setSpeedLimit] = useState(110)
  const [startDate, setStartDate] = useState(null)
  const [finishDate, setFinishDate] = useState(null)
  const [lastLat, setLastLat] = useState(null)
  const [lastLong, setLastLong] = useState(null)
  const [keyboardVisible, setKeyboardVisible] = useState(false)
  
  useEffect(() => {
    (async () => {
      
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      _ = await Location.watchPositionAsync(
        { accuracy: 6, timeInterval: 500, distanceInterval: 0  },
        (loc) => {
          setLocation(loc)
        }
      );   
    })();

    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true); // or some other action
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false); // or some other action
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    }
  }, []);

 

  useEffect (() => {
      var val = parseInt(location?.coords?.speed) * 3600 / 1000
      if (val)
        setCurrentSpeed(val)

      if (lastLat !== 0.0 && lastLong !== 0.0){
        const distanceTemp = getDistanceFromLatLonInKm((location?.coords?.latitude), (location?.coords?.longitude), lastLat, lastLong) ?? 0.0
        distancedistance =  parseFloat(distanceTravelled)
        let a = distancedistance + distanceTemp
        if (a && val !== 0.0){
          setDisatanceTravelled(a.toString())
          calculateMaxSpeed()
          setRemainingDistance((distance - a).toString())
        }
          
      }
      setLastLat((location?.coords?.latitude))
      setLastLong((location?.coords?.longitude))

  },[location])

  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  useEffect(() => {
    calculateFinishDate() 
  }, [distance, speedLimit])

  useEffect(() => {
    calculateFinishDate() 
    setDisatanceTravelled("0.0")
    setRemainingDistance("0.0")
  }, [startDate])

const calculateMaxSpeed = () => {
let tsDiff = Date.parse(finishDate) - Date.parse(startDate)
let tsDiffasHour = parseFloat(tsDiff) / 1000.0 / 3600.0

  let distanceVal = parseFloat(distance)
  let remainingDistanceVal = distanceVal - parseFloat(distanceTravelled)

  let maxSpeed = remainingDistanceVal / tsDiffasHour / 1000
  setMaxSpeed(maxSpeed.toString())


}

  function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
    var R = 6371000; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
 
    var dLon = deg2rad(lon2-lon1); 
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    
    var d = R * c; // Distance in km
    return d;
  }
  
  function deg2rad(deg) {
    return deg * (Math.PI/180)
  }

  const calculateFinishDate = () => {
    const finishTs = Date.parse(startDate) + ((parseFloat(distance) / 1000.0 / parseFloat(speedLimit)) * 3600.0 * 1000.0)
    setFinishDate(new Date(parseInt(finishTs)))
  }

  const handlePress = () => {
    const currentTs = Date.now()
    setStartDate(new Date(currentTs))   
  }

  const onChangeDistance = (distanceVal) => {
    setDistance(parseInt(distanceVal))
  }

  const onChangeSpeedLimit = (speedVal) => {
    setSpeedLimit(parseInt(speedVal))
  }

  return (

    // <KeyboardAvoidingView
    //   behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    //   style={styles.container}>
    //   <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <View style={styles.container}>
      <View style={styles.table}>
        {/* <View style={styles.row}>
          <Text style={styles.cell}>{`Kalan Yol : ${parseFloat(remainingDistance).toFixed(2).toString()} metre`}</Text>
        </View> */}

        <View style={styles.row}>
          <View style={{ width: "50%"}}>
            <Text>{`Kalan Yol : `}</Text>
          </View>
          <View style={{ width: "50%"}}>
            <Text style={{textAlign: 'right'}}>{`${parseFloat(remainingDistance).toFixed(2).toString()} metre`}</Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={{ width: "50%"}}>
            <Text>{`Gidilen Yol : `}</Text>
          </View>
          <View style={{ width: "50%"}}>
            <Text style={{textAlign: 'right'}}>{`${parseFloat(distanceTravelled).toFixed(2).toString()} metre`}</Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={{ width: "50%"}}>
            <Text>{`Başlangıç Zamanı : `}</Text>
          </View>
          <View style={{ width: "50%"}}>
            <Text style={{textAlign: 'right'}}>{`${startDate?.toLocaleString()}`}</Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={{ width: "50%"}}>
            <Text>{`Çıkış Zamanı : `}</Text>
          </View>
          <View style={{ width: "50%"}}>
            <Text style={{textAlign: 'right'}}>{`${finishDate?.toLocaleString()}`}</Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={{ alignItems:'center', padding:5}}>
            <Text style={{ fontSize: 30 }}>{`İzin Verilen Maksimum Hız`}</Text>
          </View>
          </View>
          <View style={styles.row}>
          <View style={{ alignItems:'center'}}>
            <Text style={{ fontSize: 30 }}>{`${parseFloat(maxSpeed).toFixed(2).toString()} km/s`}</Text>
          </View>
        </View>

      </View>

      {!keyboardVisible &&
        <View style={styles.row}>
          <Speedometer
            style={styles.cell}
            value={currentSpeed}
            fontFamily='squada-one'
            max={220}
          >
            <Background />
            <Arc />
            <Needle />
            <Progress />
            <Marks />
            <Indicator />
          </Speedometer>
        </View>}

      <View style={styles.row}>
        <View style={styles.cell}>
          <View style={{padding:5}} >
          <Button
            title='Takibe Başla' onPress={handlePress} ></Button>
          </View>
          
        </View>
      </View>

      <View style={styles.row}>
        <View style={{ width: "30%" }}>
          <Text>{`Mesafe(metre) : `}</Text>
        </View>
        <View style={{ width: "70%" }}>
          <TextInput
            style={styles.input}
            onChangeText={onChangeDistance}
            value={distance.toString()}
            placeholder='Distance as meter'
            textAlign='center'
            keyboardType={"number-pad"} 
          />
        </View>
      </View>

      <View style={styles.row}>
        <View style={{ width: "30%" }}>
          <Text>{`Hız sınırı(km/s) : `}</Text>
        </View>
        <View style={{ width: "70%" }}>
          <TextInput
            style={styles.input}
            onChangeText={onChangeSpeedLimit}
            value={speedLimit.toString()}
            placeholder='Speed Limit as km/h'
            textAlign='center'
            keyboardType={"number-pad"} 
          />
            </View>
          </View>

{/*          
          <BannerAd
      unitId={adUnitId}
      size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
    /> */}
      

    </View>
    // </TouchableWithoutFeedback>
    // </KeyboardAvoidingView>


  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width:"%100",
    alignItems: 'center',
    justifyContent: 'center',
     padding: 5,
  },
  paragraph: {
    fontSize: 18,
    textAlign: 'center',
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    // padding: 10,
  },
  table: {
    width:"%100",
    // borderWidth: 1,
    // borderColor: "black",
    marginBottom: 10,
    marginTop: 30,
 },
 row: {
    flexDirection: "row",
    width:"100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
 },
 cell: {
    flex: 1,
    // padding: 10,
    // borderWidth: 1,
    // width: 200,
    // height: 200,
    textAlign: "left",
    fontSize: 18,
    color: "black",
    // borderColor: "black",
    alignItems: 'stretch'
 },
});