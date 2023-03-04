import React, { useEffect, useState } from "react";
import { View, Text, PermissionsAndroid, ActivityIndicator } from "react-native";

const Welcome = (props)=>{

    const [isLoading, setIsLoading] = useState(true);

    const requestCameraPermission = async () => {
        setIsLoading(true);
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_SMS,
            {
              title: "Read SMS Permission",
              message:
                "Balance app wants to access your sms " +
                "so we can read and analyze for your balance",
              buttonNeutral: "Ask Me Later",
              buttonNegative: "Cancel",
              buttonPositive: "OK"
            }
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log("You can use the Functionallities")
            props.navigation.navigate('Login');
            setIsLoading(false)
          } else {
            console.log("SMS permission denied");
            alert("Please grant permission");
            setIsLoading(false)
          }
        } catch (err) {
          console.warn(err);
          setIsLoading(false)
        }
      };

      useEffect(()=>{
        requestCameraPermission();
      }, [])

    return(
        <View style={{
            flex:1,
            justifyContent:'center',
            alignItems:'center',
        }}>
            {isLoading?
            <ActivityIndicator
            size={'large'}
            color={'#0099ff'}
            />:
            <Text>Please grant READ_SMS Permission.</Text>}
        </View>
    )
}

export default Welcome;