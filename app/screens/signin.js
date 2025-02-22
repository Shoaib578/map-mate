import React, { useState,useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  
  
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { loginWithEmail } from "../../services/firebase/firebaseauthService";
import Toast from "react-native-toast-message";


import * as Google from 'expo-auth-session/providers/google';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from "../../services/firebase/firebaseConfig";




const SignInScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

   const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
            clientId: Platform.select({
                android: '200499500563-fjuhufaku88hgd0s9q66udu9s64ili52.apps.googleusercontent.com',
            })
    });

     useEffect(() => {
        if (response?.type === 'success') {
            const { id_token } = response.params;
            const credential = GoogleAuthProvider.credential(id_token);
            signInWithCredential(auth, credential)
                .then(async(userCredential) => {
                    // Signed in 
                    const user = userCredential.user;
                    Toast.show({
                      type:'success',
                      text1: `Welcome, ${user.displayName}`,
                      text2: 'Your have been logged in to your account successfully. 🎉',
                      swipeable:true,
                      duration:5000
    
                    })
                   
                    navigation.reset({
                        index:0,
                        routes:[{name:'MainTabs'}],
                       
                    });
    
                  
                    
                })
                .catch((error) => {
                  Toast.show({
                    type:'error',
                    text1: 'Registration Failed',
                    text2: 'Something went wrong.Please try again',
                    swipeable:true,
                    duration:5000
                    
                  })
                });
        }
    }, [response]);
    

  const handleLogin = async () => {
    if (!email || !password) {
      Toast.show({
        type: "error",
        text1: "Invalid Input",
        text2: "Please enter both email and password.",
      });
      return;
    }

    const response = await loginWithEmail(email, password);

    if (response.success) {
      Toast.show({
        type: "success",
        text1: "Login Successful",
        text2: `Welcome back, ${response.user.displayName}`,
      });
      navigation.reset({
        index: 0,
        routes: [{ name: "MainTabs" }], // Redirect to main app screen
      });
    } else {
      Toast.show({
        type: "error",
        text1: "Login Failed",
        text2: response.error,
      });
    }
  };


  return (
    
    <View style={styles.container}>
      <StatusBar backgroundColor="#34b7b5"/>
       <View style={styles.custom_header}>
        {/* Close Button */}
        <TouchableOpacity
          onPress={() => navigation.reset({
            index: 1,
            routes: [
              { name: 'GetStart' }
            ],
          })}
          style={styles.closeButton}
        >
          <Ionicons name="close" size={24} color="#333" />
        </TouchableOpacity>

        {/* Title */}
        <Text style={styles.title}>Welcome Back</Text>
      </View>

      {/* Centered headers */}
      <View style={styles.bottomContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.heading}>Log In to Your Account</Text>
          <Text style={styles.subheading}>
            Continue exploring your favorite spots with ease.
          </Text>
        </View>

        {/* Email Input */}
        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={20} color="#666" />
          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
        </View>

        {/* Password Input */}
        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#666" />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry={!passwordVisible}
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
          <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
            <Ionicons
              name={passwordVisible ? "eye" : "eye-off"}
              size={20}
              color="#666"
            />
          </TouchableOpacity>
        </View>

        {/* Login Button */}
        <TouchableOpacity onPress={handleLogin} style={styles.loginButton}>
          <Text style={styles.buttonText}>Log In</Text>
        </TouchableOpacity>


          {/* Google Login */}
          <TouchableOpacity style={styles.googleButton} onPress={()=>promptAsync()}>
            <Ionicons name="logo-google" size={20} color="#fff" />
            <Text style={styles.googleButtonText}>Continue with Google</Text>
          </TouchableOpacity>

        {/* Register Option */}
        <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
          <Text style={styles.registerText}>
            Don't have an account?{" "}
            <Text style={styles.registerLink}>Sign Up</Text>
          </Text>
        </TouchableOpacity>

        
        {/* Forgot Password */}
        <TouchableOpacity onPress={() => navigation.navigate("Forgot Password")}>
          <Text style={[styles.registerText,{marginTop:20}]}>
            Forgot password?{" "}
            <Text style={styles.registerLink}>Reset Password</Text>
          </Text>
        </TouchableOpacity>
      </View>


    </View>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  headerContainer: {
    marginBottom:40
  },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",

    color: "#333",
  },
  subheading: {
    fontSize: 15,
    
    color: "#666",
    
    textAlign: "center",
    paddingHorizontal: 20,
  },
  bottomContainer: {
  
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#fff",
    padding: 30,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    height: "87%", // Increase the height (adjust percentage as desired)
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    width:"100%",
    padding:5,
    height:50,
    paddingLeft:13,
    paddingRight:13,
    borderRadius: 40,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: "#27a8d0",
    paddingVertical: 14,
    borderRadius: 40,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  googleButton: {
    backgroundColor: "#34b7b5",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 40,
    marginBottom: 20,
  },
  googleButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 10,
  },
  registerText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  registerLink: {
    color: "#27a8d0",
    fontWeight: "bold",
  },
  custom_header: {
    position: "absolute",
    top: Platform.OS === "ios" ? '5.5%' : '5.5%', // Adjust padding for the notch on iOS
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  closeButton: {
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 10,
  },
});

export default SignInScreen;
