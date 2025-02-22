import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Modal,
  ActivityIndicator,
} from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { auth } from "../../../services/firebase/firebaseConfig"; // Your firebase config
import { updateProfile, updateEmail, updatePassword,reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import Toast from "react-native-toast-message";

const AccountSettingsScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false); // State to control modal visibility
  const [currentPassword, setCurrentPassword] = useState(""); // Current password (for re-authentication)
  const [newPassword, setNewPassword] = useState(""); // New password
  const [passwordUpdateLoading,setPasswordUpdateLoading] = useState(false)
  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setName(user.displayName || "");
      setEmail(user.email || "");
    }
  }, []);

  const handleUpdate = async () => {
    const user = auth.currentUser;
    if (!user) {
      
      Toast.show({
        type: 'error',
        text1: 'User not logged in.',
        swipeable:true,
        duration:5000
      })
      return;
    }

    try {
      // Update display name if changed
      if (name !== user.displayName) {
        await updateProfile(user, { displayName: name });
      }
      Toast.show({
        type: 'success',
        text1: 'Your details have been updated!',
        swipeable:true,
        duration:5000
      })
      
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Failed to update your details.',
        swipeable:true,
        duration:5000
      })
    }
  };

  const handlePasswordChange = async () => {
    const user = auth.currentUser;

    try {
      if (user && currentPassword && newPassword) {
        setPasswordUpdateLoading(true)
         // Reauthenticate user before changing password
         const credential = EmailAuthProvider.credential(user.email, currentPassword);
        
         // Reauthenticate user with the credentials
         await reauthenticateWithCredential(user, credential);

        await updatePassword(user, newPassword); // Update password
        setShowPasswordModal(false); // Close modal after success
        Toast.show({
          type: 'success',
          text1: 'Your password has been updated!',
          swipeable:true,
          duration:5000
        })
      } else {
        
        Toast.show({
          type: 'error',
          text1: 'Please fill out all fields.',
          swipeable:true,
          duration:5000
        })
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Failed to update your password.',
        swipeable:true,
        duration:5000
      })
    }finally{
      setPasswordUpdateLoading(false)
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
        <Text style={styles.title}>Account Settings</Text>
      </View>

      <View style={styles.bottomContainer}>
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
            editable={false}
           
            style={[styles.input,{color:"gray"}]}
            placeholder="Email"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        

        {/* Update Button */}
        <TouchableOpacity style={styles.updateBtn} onPress={handleUpdate}>
          <Text style={styles.buttonText}>Update</Text>
        </TouchableOpacity>

        {/* Button to open password change modal */}
        <TouchableOpacity
          style={styles.changePasswordBtn}
          onPress={() => setShowPasswordModal(true)}
        >
          <Text style={styles.buttonText}>Change Password</Text>
        </TouchableOpacity>
      </View>

      {/* Modal for Changing Password */}
      <Modal
        visible={showPasswordModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowPasswordModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Change Password</Text>

            {/* Current Password Input */}
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#666" />
              <TextInput
                style={styles.input}
                placeholder="Current Password"
                secureTextEntry={true}
                value={currentPassword}
                onChangeText={setCurrentPassword}
              />
            </View>

            {/* New Password Input */}
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#666" />
              <TextInput
                style={styles.input}
                placeholder="New Password"
                secureTextEntry={true}
                value={newPassword}
                onChangeText={setNewPassword}
              />
            </View>

            {/* Update Password Button */}
            <TouchableOpacity
              style={[styles.updateBtn, passwordUpdateLoading && { opacity: 0.5 }]} // Disable button if loading
              onPress={handlePasswordChange}
              disabled={passwordUpdateLoading} // Disable button during loading
            >
              {passwordUpdateLoading ? (
                <ActivityIndicator size="small" color="#fff" /> // Show ActivityIndicator while loading
              ) : (
                <Text style={styles.buttonText}>Update Password</Text>
              )}
            </TouchableOpacity>

            {/* Close Modal Button */}
            <TouchableOpacity
              style={styles.closeModalBtn}
              onPress={() => setShowPasswordModal(false)}
            >
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
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
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    width: "100%",
    height:50,

    padding: 5,
    paddingLeft: 13,
    paddingRight: 13,
    borderRadius: 40,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  updateBtn: {
    backgroundColor: "#27a8d0",
    width: "100%",
    padding: 13,
    borderRadius: 40,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  changePasswordBtn: {
    backgroundColor: "#f0ad4e",
    width: "100%",
    padding: 13,
    borderRadius: 40,
    alignItems: "center",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  closeModalBtn: {
    backgroundColor: "#dc3545",
    width: "100%",
    padding: 13,
    borderRadius: 40,
    alignItems: "center",
    marginTop: 10,
  },
});

export default AccountSettingsScreen;
