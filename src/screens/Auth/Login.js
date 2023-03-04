import React from "react";
import { View, Text, StatusBar, TouchableOpacity, Image, Dimensions } from "react-native";
import { height, width } from "../../assets/Styles";
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import { userData } from "../../redux/LoginSlice";


const Login = (props) => {
    const dispatch = useDispatch();

    GoogleSignin.configure({
        webClientId: '',
    });

    const storeData = async (value) => {
        try {
            const jsonValue = JSON.stringify(value)
            await AsyncStorage.setItem('userData', jsonValue)
        } catch (e) {
            // saving error
            console.log('AsyncStorage error: ', e);
        }
    }

    async function onGoogleButtonPress() {
        // Check if your device supports Google Play
        await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
        // Get the users ID token
        const { idToken } = await GoogleSignin.signIn();

        // Create a Google credential with the token
        const googleCredential = auth.GoogleAuthProvider.credential(idToken);

        // Sign-in the user with the credential
        return auth().signInWithCredential(googleCredential);
    }


    const getCurrentUser = async () => {
        var userDataVal = await auth().currentUser;
        console.log('yser', userDataVal)
        await firestore().collection('users').doc(userDataVal?.providerData[0].uid?.toString()).set({
            name: userDataVal?.displayName,
            email: userDataVal?.email,
            phoneNumber: userDataVal?.phoneNumber,
            userImage: userDataVal?.photoURL,
            uid: userDataVal?.providerData[0].uid,
        }).then(() => {
            var data = {
                name: userDataVal?.displayName,
                email: userDataVal?.email,
                phoneNumber: userDataVal?.phoneNumber,
                userImage: userDataVal?.photoURL,
                uid: userDataVal?.providerData[0].uid,
            };
            storeData(data).then(() => {
                dispatch(userData({ user: data }));
            });
        }).catch((e) => {
            console.log('Error:', e)
        })
    }


    return (
        <View style={{
            flex: 1,
            backgroundColor: '#3684fe',
        }}>
            <StatusBar backgroundColor={'#3684fe'} />

            <View style={{
                marginHorizontal: 20,
                marginTop: height / 7,
            }}>
                <Text style={{
                    fontSize: 40,
                    fontWeight: '400',
                    color: '#fff',
                }}>
                    Track
                </Text>
                <Text style={{
                    fontSize: 40,
                    fontWeight: '800',
                    color: '#fff',
                }}>
                    Money Map
                </Text>
                <Text style={{
                    fontSize: 18,
                    color: '#fff',
                    width: width / 1.2,
                }}>
                    Get overview of your expenses
                    and make your smart budget.
                </Text>
            </View>

            <View
                style={{
                    alignItems: 'center',
                    marginTop: 80
                }}>
                <Image
                    source={require('./../../assets/images/money.png')}
                    style={{
                        height: 260,
                        width: 260,
                        resizeMode: 'contain',
                    }}
                />
            </View>
            <View style={{
                justifyContent: 'flex-end',
                flex: 1,
            }}>
                <TouchableOpacity
                    onPress={() =>
                        onGoogleButtonPress().then(() => {
                            console.log('Logged in');
                            getCurrentUser()
                        }).catch((e) => {
                            console.log('auth error: ', e)
                        })
                    }
                    style={{
                        backgroundColor: '#fff',
                        padding: 10,
                        // margin:20,
                        borderRadius: 6,
                        marginBottom: 50,
                        marginHorizontal: 20,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                    <Image
                        source={require('./../../assets/images/google.png')}
                        style={{
                            height: 30,
                            width: 30,
                            marginLeft: -20
                        }}
                    />
                    <Text style={{
                        color: '#3684fe',
                        fontSize: 20,
                        fontWeight: '400',
                        marginLeft: 15
                    }}>Login with Google</Text>
                </TouchableOpacity>
            </View>
        </View >
    )
}

export default Login;