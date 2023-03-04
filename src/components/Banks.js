import React from "react";
import { Image, Text } from "react-native";

const Banks = ({ bankName }) => {
    if (bankName == 'hdfc') {
        return (
            <Image
                source={require('./../assets/images/hdfc.png')}
                style={{
                    height: 30,
                    width: 90,
                    resizeMode: 'contain',
                    marginHorizontal: 10,
                }}
            />
        )
    }

    else if (bankName == 'sbi') {
        return (
            <Image
                source={require('./../assets/images/sbi.png')}
                style={{
                    height: 30,
                    width: 40,
                    resizeMode: 'contain',
                    marginHorizontal: 10,
                }}
            />
        )
    }

    else if (bankName == 'axis') {
        return (
            <Image
                source={require('./../assets/images/axis.png')}
                style={{
                    height: 30,
                    width: 90,
                    resizeMode: 'contain',
                    marginHorizontal: 10,
                }}
            />
        )
    }
    
    else if (bankName == 'icici') {
        return (
            <Image
                source={require('./../assets/images/icici.png')}
                style={{
                    height: 30,
                    width: 90,
                    resizeMode: 'contain',
                    marginHorizontal: 10,
                }}
            />
        )
    }

    else if (bankName == 'pnb') {
        return (
            <Image
                source={require('./../assets/images/pnb.png')}
                style={{
                    height: 30,
                    width: 90,
                    resizeMode: 'contain',
                    marginHorizontal: 10,
                }}
            />
        )
    }

    else{
        return(
            <Text>{bankName}</Text>
        )
    }
}

export default Banks;