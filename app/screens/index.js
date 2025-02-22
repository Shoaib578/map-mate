import React, { useEffect } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Logo from '../../assets/app-logo.png'
import { StatusBar } from "expo-status-bar";
import {  onAuthStateChanged } from "firebase/auth";
import { auth } from "../../services/firebase/firebaseConfig";

const SplashScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const timer = setTimeout(() => {
     
      onAuthStateChanged(auth, (user) => {
        if (user) {
       
          // User is logged in
          navigation.reset({
            index:0,
            routes:[{name:'MainTabs'}],
           
        });
        } else {
          // User is logged out
          navigation.replace("GetStart");

        }
      })
    }, 2000); // 2 seconds delay

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
            <StatusBar backgroundColor="#34b7b5"/>
      
      <Image source={Logo} style={{ width:250,height:250 }}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { fontSize: 24, fontWeight: "bold" },
});

export default SplashScreen;
