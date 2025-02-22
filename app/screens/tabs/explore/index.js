import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
  FlatList,
  Text,
  Linking,
  Image,
  Share,
  ActivityIndicator,
  RefreshControl,
  Platform,
  PermissionsAndroid
} from "react-native";
import * as FileSystem from "expo-file-system";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";

import {
  collection,
  query,
  orderBy,
  limit,
  startAfter,
  getDocs,
  where,
  onSnapshot,
} from "firebase/firestore";
import * as Location from "expo-location";
import { Swipeable } from "react-native-gesture-handler";
import { deleteDocument } from "../../../../services/firebase/firebaseDbService";
import { auth, db } from "../../../../services/firebase/firebaseConfig";
import Toast from "react-native-toast-message";
import { debounce } from "lodash";


const PAGE_SIZE = 5; // Number of items per page
const ExploreScreen = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [lastDoc, setLastDoc] = useState(null);
  const [loading, setLoading] = useState(true); // Initial loading
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const flatListRef = useRef(null);

  // Debounce search function
  const debouncedSearch = debounce((text) => {
    setSearchQuery(text);
  }, 300);

  // Function to remove duplicates using JavaScript Set
  const removeDuplicates = (array) => {
    const uniqueSet = new Set();
    return array.filter((item) => {
      if (!uniqueSet.has(item.id)) {
        uniqueSet.add(item.id);
        return true;
      }
      return false;
    });
  };





  const getLocationName = async (latitude, longitude) => {
    try {
      const geocode = await Location.reverseGeocodeAsync(
        { latitude, longitude },
        { useGoogleMaps: false }
      );

      if (geocode.length > 0) {
        const locationName = `${geocode[0].street}, ${geocode[0].city}, ${geocode[0].region}, ${geocode[0].country}`;
        return locationName;
      } else {
        return "Unknown location";
      }
    } catch (error) {
      return "Unknown location";
    }
  };

  const shareLocation = async (item) => {
    try {
      const message = `Check out this location: ${item.title}\n ${
        item.locationName ? item.locationName.replace(/^null,/, "") : null
      } \nDescription: ${item.description}\nLatitude: ${item.latitude}\nLongitude: ${item.longitude}`;

      const locationUrl = `https://www.google.com/maps/dir/?api=1&destination=${item.latitude},${item.longitude}&travelmode=driving`;
      const shareMessage = `${message}\nLocation: ${locationUrl}`;

      const result = await Share.share({
        message: shareMessage,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log(`Shared with activity type: ${result.activityType}`);
        } else {
          console.log("Location shared successfully!");
        }
      }
    } catch (error) {
      console.error("Error sharing location:", error);
    }
  };

  const renderRightActions = (item) => {
    return (
      <TouchableOpacity
        style={{
          backgroundColor: "red",
          justifyContent: "center",
          alignItems: "center",
          height: "96%",
          padding: 20,
          borderRadius: 20,
        }}
        onPress={() => handleDelete(item)}
      >
        <Ionicons name="trash-outline" size={24} color="white" />
      </TouchableOpacity>
    );
  };

  const fetchData = async (newSearchQuery = searchQuery) => {
    setLoading(true);
    setHasMore(true);
    setLastDoc(null);
  
    let q = query(
      collection(db, "locations"),
      where("user_id", "==", auth.currentUser.uid),
      ...(newSearchQuery
        ? [
            where("title", ">=", newSearchQuery),
            where("title", "<=", newSearchQuery + "\uf8ff"),
          ]
        : []),
      orderBy("created_at", "desc"),
      limit(PAGE_SIZE)
    );
  
    try {
      const snapshot = await getDocs(q); // Fetch new data
  
      const newData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
  
      if (newData.length === 0) {
        setHasMore(false);
      }
  
      const updatedData = await Promise.all(
        newData.map(async (item) => {
          if (item.latitude && item.longitude) {
            const locationName = await getLocationName(
              item.latitude,
              item.longitude
            );
            return { ...item, locationName };
          }
          return { ...item, locationName: "Unknown location" };
        })
      );
  
      setData(updatedData); // Only update data here
      setHasMore(snapshot.docs.length > 0);
  
      if (snapshot.docs.length > 0) {
        setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      Toast.show({
        text1: "Error fetching data",
        type: "error",
        duration: 2000,
        swipeable: true,
      });
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchMoreData = async () => {
    if (!hasMore || loadingMore) return;
    setLoadingMore(true);

    let q = query(
      collection(db, "locations"),
      where("user_id", "==", auth.currentUser.uid),
      ...(searchQuery
        ? [
            where("title", ">=", searchQuery),
            where("title", "<=", searchQuery + "\uf8ff"),
          ]
        : []), // Firestore-based search
      orderBy("created_at", "desc"),
      startAfter(lastDoc),
      limit(PAGE_SIZE)
    );

    try {
      const snapshot = await getDocs(q); // Use getDocs for subsequent fetches
      const newData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      if (newData.length === 0) {
        setHasMore(false);
      }

      const updatedData = await Promise.all(
        newData.map(async (item) => {
          if (item.latitude && item.longitude) {
            const locationName = await getLocationName(
              item.latitude,
              item.longitude
            );
            return { ...item, locationName };
          }
          return { ...item, locationName: "Unknown location" };
        })
      );

      const uniqueData = removeDuplicates([...data, ...updatedData]);
      setData(uniqueData);
      if (snapshot.docs.length > 0) {
        setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching more data:", error);
      Toast.show({
        text1: "Error fetching more data",
        type: "error",
        duration: 2000,
        swipeable: true,
      });
      setHasMore(false); // prevent from keep loading
    } finally {
      setLoadingMore(false);
    }
  };

  useEffect(()=>{
   
    fetchData()
    
  },[])
   // Use useFocusEffect to refetch data when the screen comes into focus
   useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchData(); // Fetch data when screen is focused
    });

    return unsubscribe; // Cleanup listener on unmount
  }, [navigation]);
 
  useEffect(() => {
    //New useEffect to handle search quey
    fetchData();
  }, [searchQuery]);

  const onRefresh = async () => {
    setData([]);
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const openGoogleMaps = (targetLatitude, targetLongitude) => {
    let url = `google.navigation:q=${targetLatitude},${targetLongitude}`; // Android

    if (Platform.OS === "ios") {
      url = `maps://app?daddr=${targetLatitude},${targetLongitude}`; // iOS
    }

    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(url);
        }
      })
      .catch((err) => {
        Toast.show({
          text1: `Unable to open Google Maps`,
          type: "error",
          duration: 2000,
          swipeable: true,
        });
      });
  };
  const handleDelete = async (item) => {
    Alert.alert(
      "Confirm Delete",
      `Are you sure you want to delete "${item.title}"?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              if (item.imageUri) {
                const imageUri = item.imageUri.split("/").pop();
                const imagePath =
                  FileSystem.documentDirectory + "MapMate/" + imageUri;
                const file = await FileSystem.getInfoAsync(imagePath);
                if (file.exists) {
                  await FileSystem.deleteAsync(imagePath);
                }
              }

              const result = await deleteDocument("locations", item.id);
              if (result.success) {
                const updatedData = data.filter(
                  (location) => location.id !== item.id
                );
                setData(updatedData);
                Toast.show({
                  text1: `"${item.title}" has been deleted successfully.`,
                  type: "success",
                  duration: 2000,
                  swipeable: true,
                });
              } else {
                Toast.show({
                  text1: `Could not delete the location. Please try again.`,
                  type: "error",
                  duration: 2000,
                  swipeable: true,
                });
              }
            } catch (error) {
              Toast.show({
                text1: `Could not delete the location. Please try again.`,
                type: "error",
                duration: 2000,
                swipeable: true,
              });
            }
          },
        },
      ]
    );
  };

  const handleAddNewSpot = () => {
    navigation.navigate("AddLocation");
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#34b7b5" />

      <TextInput
        style={styles.searchInput}
        placeholder="Search Locations"
        onChangeText={debouncedSearch}
      />
      <Text style={styles.title}>Explore Your Saved Spots</Text>

      <FlatList
        ref={flatListRef}
        data={data}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Swipeable renderRightActions={() => renderRightActions(item)}>
            <View style={styles.card}>
              {item.imageUri ? (
                <Image source={{ uri: item.imageUri }} style={styles.cardImage} />
              ) : null}
              <Text style={styles.cardTitle}>{item.title}</Text>
             
              {item.locationName ? (
                <View style={styles.locationSection}>
                  <Ionicons name="location" style={{ color: "white", fontSize: 18 }} />
                  <Text style={styles.locationName}>{item.locationName.replace(/^null,/, "")}</Text>
                </View>
              ) : null}
              <View style={styles.cardBottomSection}>
                <TouchableOpacity
                  style={styles.cardButton}
                  onPress={() => shareLocation(item)}
                >
                  <Ionicons
                    name="share-social-sharp"
                    style={{ color: "white", fontSize: 18 }}
                  />
                  <Text style={{ color: "white", fontSize: 15 }}>Share</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('Navigate', { latitude: 37.7749, longitude: -122.4194 });

                  }}
                  style={styles.cardButton}
                >
                  <Ionicons
                    name="navigate-circle-sharp"
                    style={{ color: "white", fontSize: 18 }}
                  />
                  <Text style={{ color: "white", fontSize: 15 }}>Navigate</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Swipeable>
        )}
        ListFooterComponent={() =>
          loadingMore &&  !loading? <ActivityIndicator size="large" color="#27a8d0" /> : null
        }
        ListEmptyComponent={() =>
          loading ? (
            <ActivityIndicator size="large" color="#27a8d0" />
          ) : (
            <Text>No locations found.</Text>
          )
        }
        onEndReached={fetchMoreData}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

      <TouchableOpacity style={styles.fab} onPress={handleAddNewSpot}>
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  searchInput: {
    height: 50,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
    borderRadius: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  fab: {
    position: "absolute",
    bottom: 50,
    right: 25,
    backgroundColor: "#27a8d0",
    borderRadius: 50,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  card: {
    padding: 20,
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 20,
    marginBottom: 10,
    backgroundColor: "white",
  },
  cardImage: {
    height: 100,
    borderRadius: 10,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "bold",
  },
  cardBottomSection: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  cardButton: {
    flexDirection: "row",
    gap: 10,
    backgroundColor: "#27a8d0",
    padding: 10,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  locationSection: {
    flexDirection: "row",
    backgroundColor: "#78cce6",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    marginTop: 10,
    justifyContent: "center",
  },
  locationName: {
    color: "white",
    fontWeight: "bold",
  },
});

export default ExploreScreen;
