import React, { useState,useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,

} from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import Toast from 'react-native-toast-message';

// Import Firebase Auth functions
import { registerWithEmail } from "../../services/firebase/firebaseauthService";
import * as Google from 'expo-auth-session/providers/google';
import { GoogleAuthProvider, signInWithCredential,getAuth } from 'firebase/auth';
import { app } from "../../services/firebase/firebaseConfig";

const auth = getAuth(app)

const SignupScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

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

  // Handle Email Signup
  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      Toast.show({
        type:'error',
        text1: 'Registration Failed',
        text2: 'Passwords do not match',
        swipeable:true,
        text1Style:{fontSize:18},
        text2Style:{fontSize:14},
        duration:5000
        
      })
      return;
    }
    
    const result = await registerWithEmail(name,email, password);

    if (result.success) {
      Toast.show({
        type:'success',
        text1: 'Welcome!',
        text2: 'Your account has been created successfully. 🎉',
        swipeable:true,
        duration:5000
       
        
      })
      
    } else {
      Toast.show({
        type:'error',
        text1: 'Registration Failed',
        text2: result.error,
        swipeable:true,
        duration:5000

      })
    }
  };

 
  return (
    <View style={styles.container}>

      <StatusBar backgroundColor="#34b7b5" />
      <View style={styles.custom_header}>

        {/* Close Button */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.closeButton}
        >
          <Ionicons name="close" size={24} color="#333" />
        </TouchableOpacity>

        {/* Title */}
        <Text style={styles.title}>Create Your Account</Text>
      </View>

      <View style={styles.bottomContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.heading}>Create Your Account</Text>
          <Text style={styles.subheading}>
            Join us and start exploring your favorite spots today!
          </Text>
        </View>

        {/* Name Input */}
        <View style={styles.inputContainer}>
          <FontAwesome name="user" size={20} color="#666" />
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={name}
            onChangeText={setName}
          />
        </View>

        {/* Email Input */}
        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={20} color="#666" />
          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
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
            onChangeText={setPassword}
          />
          <TouchableOpacity
            onPress={() => setPasswordVisible(!passwordVisible)}
          >
            <Ionicons
              name={passwordVisible ? "eye" : "eye-off"}
              size={20}
              color="#666"
            />
          </TouchableOpacity>
        </View>

        {/* Confirm Password Input */}
        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#666" />
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            secureTextEntry={!confirmPasswordVisible}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <TouchableOpacity
            onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
          >
            <Ionicons
              name={confirmPasswordVisible ? "eye" : "eye-off"}
              size={20}
              color="#666"
            />
          </TouchableOpacity>
        </View>

        {/* Sign Up Button */}
        <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        {/* Google Login */}
        <TouchableOpacity style={styles.googleButton} onPress={()=>promptAsync()}>
          <Ionicons name="logo-google" size={20} color="#fff" />
          <Text style={styles.googleButtonText}>Continue with Google</Text>
        </TouchableOpacity>

        {/* Register Option */}
        <TouchableOpacity onPress={() => navigation.navigate("Signin")}>
          <Text style={styles.login_text}>
            Already have an account?{" "}
            <Text style={styles.loginLink}>Sign in</Text>
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
 
  loginLink: {
    color: "#27a8d0",
    fontWeight: "bold",
  },
  login_text:{
    fontSize: 14,
    color: "#666",
    textAlign: "center",
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
    height: "87%", // Increase the height
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
  signUpButton: {
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
});

export default SignupScreen;
