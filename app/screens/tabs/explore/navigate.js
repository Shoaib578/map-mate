import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import * as Location from "expo-location";
import MapView, { Marker, Polyline } from "react-native-maps";

const Navigate = ({ route, navigation }) => {
  const { latitude, longitude } = route.params;
  const [currentLocation, setCurrentLocation] = useState(null);
  const [distance, setDistance] = useState(null); // New state for distance

  const getCurrentLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permission denied');
      navigation.goBack();
      return;
    }

    const location = await Location.getCurrentPositionAsync({});
    setCurrentLocation({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });

    // Calculate distance once we get current location
    const calculatedDistance = calculateDistance(
      { latitude: location.coords.latitude, longitude: location.coords.longitude },
      { latitude, longitude }
    );
    setDistance(calculatedDistance);
  };

  const calculateDistance = (start, end) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (end.latitude - start.latitude) * (Math.PI / 180);
    const dLon = (end.longitude - start.longitude) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(start.latitude * (Math.PI / 180)) *
        Math.cos(end.latitude * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
    return Math.round(R * c * 1000); // Convert to meters and round
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#34b7b5" />
      
      {/* Header */}
      <View style={styles.custom_header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
          <Ionicons name="close" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Navigate</Text>
      </View>

      {/* Map Container */}
      <View style={styles.bottomContainer}>
        {currentLocation ? (
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: currentLocation.latitude,
              longitude: currentLocation.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            {/* Current Location Marker */}
            <Marker coordinate={currentLocation} title="My Location" />

            {/* Destination Marker */}
            <Marker coordinate={{ latitude, longitude }} title="Destination" />

            {/* Route Line */}
            <Polyline
              coordinates={[
                { latitude: currentLocation.latitude, longitude: currentLocation.longitude },
                { latitude, longitude },
              ]}
              strokeColor="blue"
              strokeWidth={4}
            />
          </MapView>
        ) : (
          <View style={styles.loaderContainer}>
            <ActivityIndicator color={"#34b7b5"} size={"large"} />
          </View>
        )}

        {/* Distance Container */}
        <View style={styles.distanceContainer}>
          <Text style={styles.distanceText}>
            Distance: {distance ? `${distance} meters` : "Calculating..."}
          </Text>
        </View>
      </View>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  bottomContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    height: "87%",
    paddingBottom: 20, // Extra space for distance
  },
  custom_header: {
    position: "absolute",
    top: Platform.OS === "ios" ? "5.5%" : "5.5%",
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
  map: {
    flex: 1,
   
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  distanceContainer: {
    position: "absolute",
    bottom: 20,
    left: "50%",
    transform: [{ translateX: -50 }], // Centering the text
    backgroundColor: "#34b7b5",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    elevation: 5,
  },
  distanceText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
});

export default Navigate;
