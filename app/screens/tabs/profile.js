import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { logout } from "../../../services/firebase/firebaseauthService";
import { auth } from "../../../services/firebase/firebaseConfig"; // Adjust path as per your setup
import Toast from "react-native-toast-message";



const ProfileScreen = ({ navigation }) => {
  const [displayName,setDisplayName] = useState(auth.currentUser.displayName)

  const handleLink = (url) => {
    Linking.openURL(url); // This opens a URL in the default web browser
  };

  useEffect(()=>{
    navigation.addListener('focus', () => {
      setDisplayName(auth.currentUser.displayName);
    });
  },[])

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#34b7b5" />
      
      {/* Profile Section */}
      <View style={styles.profileContainer}>
        {/* Greeting */}

        {/* Profile Title */}
        <Text style={styles.profileTitle}>Profile</Text>

        {/* Avatar Image */}
        <Image
          style={styles.avatar}
          source={ require('../../../assets/default_avatar.png')} // Replace with actual image URL
        />
       
        
        {/* Name and Email */}
        <Text style={styles.name}>{displayName}</Text>
        <Text style={styles.email}>{auth.currentUser.email}</Text>
      </View>

      {/* Buttons Section */}
      <View style={styles.buttonsContainer}>
        {/* Account Settings */}
        <TouchableOpacity
          onPress={() => navigation.navigate("AccountSettings")}
          style={styles.button}
        >
          <Ionicons name="settings-outline" size={24} color="#fff" style={styles.icon} />
          <Text style={styles.buttonText}>Account Settings</Text>
        </TouchableOpacity>

        {/* Privacy Policy */}
        <TouchableOpacity onPress={()=>handleLink('https://www.freeprivacypolicy.com/live/90ce7ecb-31c9-4a3f-8508-d8719fe5c4e8')} style={styles.button}>
          <Ionicons name="shield-outline" size={24} color="#fff" style={styles.icon} />
          <Text style={styles.buttonText}>Privacy Policy</Text>
        </TouchableOpacity>

        {/* Logout */}
        <TouchableOpacity
          style={styles.button}
          onPress={async () => {
            const firebaseLogout = await logout();
            if (firebaseLogout.success) {
              Toast.show({
                type: "success",
                text1: "Logged out successfully",
                text2: "You have been logged out successfully",
                swipeable: true,
                duration: 5000,
              });
              navigation.reset({
                index: 0,
                routes: [{ name: "Signin" }],
              });
            } else {
              Toast.show({
                type: "error",
                text1: "Logout Failed",
                text2: "Failed to log out. Please try again",
                swipeable: true,
                duration: 5000,
              });
            }
          }}
        >
          <Ionicons name="log-out-outline" size={24} color="#fff" style={styles.icon} />
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f5",
    padding: 20,
  },
  profileContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  
  profileTitle: {
    fontSize: 28,
    color: "#333",
    marginBottom: 60,
    marginTop: "10%",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: "#666",
  },
  buttonsContainer: {
    flex: 1,
    justifyContent: "flex-start",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#27a8d0",
    padding: 15,
    marginBottom: 15,
    borderRadius: 40,
    elevation: 3,
  },
  icon: {
    marginRight: 15,
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "600",
  },
});

export default ProfileScreen;
