import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

import { auth } from "./firebaseConfig"; // Adjust path as per your setup


// Login with Email and Password
export const loginWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    let customMessage = "An unexpected error occurred. Please try again later.";

    // Customize error messages based on error code
    switch (error.code) {
      case "auth/invalid-credential":
        customMessage = "Invalid email or Password. Please check and try again.";
        break;
      case "auth/invalid-email":
        customMessage = "The email address is not valid. Please check and try again.";
        break;
      case "auth/user-disabled":
        customMessage = "This user account has been disabled. Contact support for assistance.";
        break;
      case "auth/user-not-found":
        customMessage = "No user found with this email. Please register or try another email.";
        break;
      case "auth/wrong-password":
        customMessage = "The password is incorrect. Please check and try again.";
        break;
      default:
        customMessage = error.message; // Optionally, fall back to the default Firebase error message
    }

    return { success: false, error: customMessage };
  }
};


// Register with Email and Password
export const registerWithEmail = async (name,email, password) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

       // Update the display name
        await updateProfile(user, {
            displayName: name,
        });

      return { success: true, user: userCredential.user };
    } catch (error) {
      console.log(error)
      let errorMessage = "An unexpected error occurred.";
      switch (error.code) {
        case "auth/email-already-in-use":
          errorMessage = "This email is already registered. Please use a different email or login.";
          break;
        case "auth/invalid-email":
          errorMessage = "The email address is invalid. Please enter a valid email.";
          break;
        case "auth/weak-password":
          errorMessage = "The password is too weak. Please enter a stronger password.";
          break;
        default:
          errorMessage = error.message; // Use Firebase's default error if needed
      }
      
      return { success: false, error: errorMessage };
    }
  };
  



// Logout
export const logout = async () => {
  try {
    await auth.signOut();
    return { success: true };
  } catch (error) {
    console.error("Error logging out:", error);
    return { success: false, error: error.message };
  }
};
