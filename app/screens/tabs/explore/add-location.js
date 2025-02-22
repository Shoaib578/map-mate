import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { StatusBar } from "expo-status-bar";
import { auth } from "../../../../services/firebase/firebaseConfig"; 
import { insertDocument } from "../../../../services/firebase/firebaseDbService"; 
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";
import * as Location from "expo-location"; // Import Expo Location API
import Toast from "react-native-toast-message";

const AddLocationScreen = ({ navigation }) => {
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const getUserCoordinates = async () => {
    try {
   
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        
        Toast.show({
          text1: `Permission Denied! Location permission is required.`,
          type: "error",
          duration: 2000,
          swipeable: true,
        });
        return null;
      }

      // Get current position
      const location = await Location.getCurrentPositionAsync({});
      return location.coords;
    } catch (error) {
      Toast.show({
        text1: `Could not fetch location.`,
        type: "error",
        duration: 2000,
        swipeable: true,
      });
      
      return null;
    }
  };


 
  const pickImage = async (source) => {
    let result;
    if (source === "camera") {
      result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
    } else {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
    }

    if (!result.canceled) {
      const uri = result.assets ? result.assets[0].uri : result.uri;
      const permission = await MediaLibrary.requestPermissionsAsync();

      if (permission.granted) {
        setImage(uri);
        moveImageToMapMate(uri);
      } else {
        Toast.show({
          text1: `Permission Denied Cannot save the image to gallery.`,
          type: "error",
          duration: 2000,
          swipeable: true,
        });
       
      }
    }
  };
  

  const moveImageToMapMate = async (uri) => {
    try {
      const mapMateFolder = FileSystem.documentDirectory + "MapMate/";
      const fileName = uri.split("/").pop();
      const newPath = mapMateFolder + fileName;

      const folderInfo = await FileSystem.getInfoAsync(mapMateFolder);
      if (!folderInfo.exists) {
        await FileSystem.makeDirectoryAsync(mapMateFolder, { intermediates: true });
      }

      await FileSystem.copyAsync({
        from: uri,
        to: newPath,
      });

      const asset = await MediaLibrary.createAssetAsync(newPath);
      const album = await MediaLibrary.getAlbumAsync("MapMate");
      if (!album) {
        await MediaLibrary.createAlbumAsync("MapMate", asset, false);
      } else {
        await MediaLibrary.addAssetsToAlbumAsync([asset], album.id);
      }
      
    } catch (error) {
      Toast.show({
        text1: `Failed to move image to 'MapMate' folder.`,
        type: "error",
        duration: 2000,
        swipeable: true,
      });
      
    }
  };

  const handleAddLocation = async () => {
    if (!title || !description ) {
     
      Toast.show({
        text1: `All fields are required!`,
        type: "error",
        duration: 2000,
        swipeable: true,
      });
      return;
    }

    setIsLoading(true);

    try {
      const user = auth.currentUser;
      if (!user) {
        
        Toast.show({
          text1: `User not logged in!`,
          type: "error",
          duration: 2000,
          swipeable: true,
        });
        setIsLoading(false);
        return;
      }

      // Get user coordinates using Expo Location
      const coords = await getUserCoordinates();
      if (!coords) return;

      const locationData = {
        title,
        description,
        imageUri: image, 
        user_id: user.uid,
        created_at: new Date().toISOString(),
        latitude: coords.latitude,
        longitude: coords.longitude,
      };

      // Save the data to Firestore
      const result = await insertDocument("locations", locationData);

      if (result.success) {
        Toast.show({
          text1: `Location added successfully!`,
          type: "success",
          duration: 2000,
          swipeable: true,
        });
        setImage(null);
        setTitle("");
        setDescription("");
      } else {
       
        Toast.show({
          text1: `Failed to add location. Please try again`,
          type: "success",
          duration: 2000,
          swipeable: true,
        });
      }
    } catch (error) {
      Toast.show({
        text1: `Failed to add location. Please try again`,
        type: "success",
        duration: 2000,
        swipeable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#34b7b5" />
      <View style={styles.custom_header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
          <Ionicons name="close" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Add Location</Text>
      </View>
      <View style={styles.bottomContainer}>
        <View style={styles.imagePickerContainer}>
          <TouchableOpacity style={styles.imageButton} onPress={() => pickImage("camera")}>
            <Ionicons name="camera-outline" size={24} color="#fff" />
            <Text style={styles.imageButtonText}>Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.imageButton} onPress={() => pickImage("gallery")}>
            <Ionicons name="images-outline" size={24} color="#fff" />
            <Text style={styles.imageButtonText}>Gallery</Text>
          </TouchableOpacity>
        </View>
        {image && <Image source={{ uri: image }} style={styles.imagePreview} />}
        <TextInput
          style={styles.input}
          placeholder="Title"
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
          multiline={true}
          numberOfLines={4}
        />
        <TouchableOpacity 
          style={styles.addButton} 
          onPress={handleAddLocation} 
          disabled={isLoading} // Disable button when loading
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.addButtonText}>Add Location</Text>
          )}
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
    height: "87%",
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
  imagePickerContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginBottom: 20,
  },
  imageButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#27a8d0",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 30,
  },
  imageButtonText: {
    color: "#fff",
    marginLeft: 5,
    fontWeight: "600",
  },
  imagePreview: {
    width: "100%",
    height: 200,
    borderRadius: 15,
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 20,
    fontSize: 16,
  },
  textArea: {
    height: 150,
    textAlignVertical: "top",
  },
  addButton: {
    backgroundColor: "#27a8d0",
    paddingVertical: 10,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 10,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default AddLocationScreen;
