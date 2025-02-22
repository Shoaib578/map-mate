import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc, getDoc, query } from "firebase/firestore";
import { db } from "./firebaseConfig"; // Ensure the correct path to firebaseConfig.js



// Add Document
export const insertDocument = async (collectionName, data) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), data);
    
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error adding document: ", error);
    return { success: false, error };
  }
};

// Get All Documents
export const getUserDocuments = async (collectionName,userId) => {
    try {
        const q =   query(collection(db, collectionName), where("user_id", "==", userId));
        const querySnapshot = await getDocs(q);
    
        const documents = [];
        querySnapshot.forEach((doc) => {
          documents.push({ id: doc.id, ...doc.data() });
        });
    
        return { success: true, documents };
      } catch (error) {
        console.error("Error fetching user documents: ", error);
        return { success: false, error };
      }
};

// Get Single Document
export const getDocumentById = async (collectionName, id) => {
  try {
    const docRef = doc(db, collectionName, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { success: true, document: { id, ...docSnap.data() } };
    } else {
      console.log("No such document!");
      return { success: false, error: "Document not found" };
    }
  } catch (error) {
    console.error("Error fetching document: ", error);
    return { success: false, error };
  }
};

// Update Document
export const updateDocument = async (collectionName, id, data) => {
  try {
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, data);
    console.log("Document updated successfully!");
    return { success: true };
  } catch (error) {
    console.error("Error updating document: ", error);
    return { success: false, error };
  }
};

// Delete Document
export const deleteDocument = async (collectionName, id) => {
  try {
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
    console.log("Document deleted successfully!");
    return { success: true };
  } catch (error) {
    console.error("Error deleting document: ", error);
    return { success: false, error };
  }
};
