import { StatusBar } from "expo-status-bar";
import React,{useEffect} from "react";
import { View, Text, TouchableOpacity, StyleSheet,Image,Linking } from "react-native";
import AppIntroSlider from "react-native-app-intro-slider";


const slides = [
  {
    key: '1',
    title: 'Discover & Revisit Locations',
    text: 'Save locations, ensuring easy access to your favorite places whenever you need them.',
    image: require('../../assets/first_intro.png'), // replace with your images
    backgroundColor: '#27a8d0',
  },
  {
    key: '2',
    title: 'Share Your Spots with Friends',
    text: 'Easily share your saved locations with others, so your friends can discover and visit your favorite places too!',
    image: require('../../assets/second_intro.png'),
  
  },
  {
    key: '3',
    title: 'Get Directions Instantly',
    text: 'Quickly get directions to any saved location with a single tap, and find your way.',
    image: require('../../assets/final_intro.png'),
    backgroundColor: '#ff7c40',
  }
];




const GetStartScreen = ({ navigation }) => {



  const handleLink = (url) => {
    Linking.openURL(url); // This opens a URL in the default web browser
  };

  const renderItem = ({ item }) => {
    return (
      <View style={[styles.slide]}>
        <Image source={item.image} style={styles.image} />
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.text}>{item.text}</Text>
      </View>
    );
  };


  return (
    <View style={styles.container}>
            <StatusBar backgroundColor="#34b7b5"/>
      
      <AppIntroSlider
      renderItem={renderItem}
      data={slides}
      showNextButton={false}
      showDoneButton={false}
     />


      <View style={styles.drawerContainer}>
        <TouchableOpacity
          style={[styles.button, styles.signUpButton]}
          onPress={() => navigation.navigate("Signup")}
        >
          <Text style={styles.buttonText}>Get started</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.signInButton]}
          onPress={() => navigation.navigate("Signin")}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

       {/* Terms of Service and Privacy Policy disclaimer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          By continuing, you agree to{" "}
          <Text 
            style={styles.linkText} 
            onPress={() => handleLink("https://yourapp.com/terms-of-service")}
          >
            Terms of Service
          </Text>{" "}
          and{" "}
          <Text 
            style={styles.linkText} 
            onPress={() => handleLink("https://www.freeprivacypolicy.com/live/90ce7ecb-31c9-4a3f-8508-d8719fe5c4e8")}
          >
            Privacy Policy
          </Text>.
        </Text>
      </View>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    justifyContent: "flex-end", // Ensure drawer container is at the bottom
  },
 
  drawerContainer: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 30,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5, // For Android shadow effect
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#27a8d0',
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: '#34b7b5',
    textAlign: 'center',
  },
  button: {
    paddingVertical: 12,
    borderRadius: 40,
    marginBottom: 15,
    alignItems: "center",
  },
  signInButton: {
    backgroundColor: "#27a8d0",
    marginBottom:'5%',
  },
  signUpButton: {
    backgroundColor: "#34b7b5", // Complementary color for Sign Up
   
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  footer: {
    alignItems: "center",
    marginVertical: 15,
    paddingHorizontal: 10,
  },
  footerText: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
  linkText: {
    color: "#27a8d0",  // Highlight the link text with your primary color
    textDecorationLine: "underline",
  },
});

export default GetStartScreen;
