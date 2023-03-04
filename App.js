import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StatusBar } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import AuthStack from "./src/navigation/AuthStack";
import AppStack from "./src/navigation/AppStack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { userData } from "./src/redux/LoginSlice";

const App = (props)=>{
  const userDetails = useSelector((state) => state.userData.value);
  const dispatch = useDispatch();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('userData')
      if (value !== null) {
        return JSON.parse(value);
      }
      else return null;
    } catch (e) {
      // error reading value
    }
  }

  useEffect(() => {
    getData().then((e) => {
      if (e != null && Object.keys(userDetails).length==0) {
        dispatch(userData({ user: e }));
        setIsLoggedIn(true);
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      }

      else if(e != null && Object.keys(userDetails).length>0){
        setIsLoggedIn(true);
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      }
      else if(e==null) {
        console.log('Else part')
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
        setIsLoggedIn(false);
      }
    })
  }, [userDetails]);

  return(
    <View style={{flex:1}}>
       <StatusBar backgroundColor={'#3684fe'} />
      {isLoading ? <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:'#3684fe',
      }}>
        <ActivityIndicator size={'large'} color={'#fff'} />
      </View> : (isLoggedIn ?
        <AppStack /> : <AuthStack />)}
    </View>
  )
}

export default App;