import 'react-native-gesture-handler'
import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Toast, { BaseToast,ErrorToast } from 'react-native-toast-message';

import SplashScreen from "./app/screens";
import GetStartScreen from "./app/screens/get-start";
import SigninScreen from "./app/screens/signin";
import SignupScreen from "./app/screens/signup";
import TabNavigator from "./app/screens/tabs";
import * as Splash from 'expo-splash-screen';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import ForgotPasswordScreen from "./app/screens/forgot_password";

const Stack = createStackNavigator();

const toastConfig = {
  
  success: (props) => (
    <BaseToast
      {...props}
      
      style={{ borderLeftColor: 'green',backgroundColor:'#34b7b5',marginTop:70 }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text2Style={{
        fontSize: 13,
        color:'white',
      
      }}

      text1Style={{
        fontSize: 15,
        color:'white',
        fontWeight: 'bold'
      }}
      
    />
  ),
  /*
    Overwrite 'error' type,
    by modifying the existing `ErrorToast` component
  */
  error: (props) => (
    <ErrorToast
      {...props}
      style={{backgroundColor:'#ff7474',borderLeftColor:'red',marginTop:70}}
      text1Style={{
        color:'white',
        fontSize: 17
      }}
      text2Style={{
        color:'white',

        fontSize: 13
      }}
    />
  )
  
};

Splash.preventAutoHideAsync()
export default function App() {
  useEffect(()=>{
    Splash.hideAsync()
  },[])
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>

    <NavigationContainer>

      <Stack.Navigator initialRouteName="Splash" screenOptions={{gestureEnabled:true}}>
        <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
        <Stack.Screen name="GetStart" component={GetStartScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Signin" component={SigninScreen} options={{ headerShown:false }}/>
        <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown:false }}/>
        <Stack.Screen name="Forgot Password" component={ForgotPasswordScreen} options={{ headerShown:false }} />
        <Stack.Screen name="MainTabs" component={TabNavigator} options={{ headerShown: false }} />
      </Stack.Navigator>
      <Toast config={toastConfig} />

    </NavigationContainer>
    </GestureHandlerRootView>
  );
}
