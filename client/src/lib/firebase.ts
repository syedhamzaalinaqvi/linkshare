import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, signInWithRedirect, signOut, onAuthStateChanged } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID || ""}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: `${
    import.meta.env.VITE_FIREBASE_PROJECT_ID || ""
  }.appspot.com`,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Authentication functions
export const loginWithGoogle = () => signInWithRedirect(auth, googleProvider);
export const logoutUser = () => signOut(auth);

// Handle redirect result
export const handleAuthRedirect = async () => {
  try {
    // Firebase automatically handles the redirect result
    return { success: true };
  } catch (error) {
    console.error("Authentication error:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown authentication error" 
    };
  }
};

// Helper to create a listener for auth state changes
export const createAuthListener = (callback: Parameters<typeof onAuthStateChanged>[1]) => {
  return onAuthStateChanged(auth, callback);
};
