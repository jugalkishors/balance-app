import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import Home from '../screens/Home';
import Month from '../screens/Month';
const Stack = createStackNavigator();

function AppStack() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Month" component={Month} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppStack;
