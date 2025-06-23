// firebase-init.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// Your actual Firebase project configuration
const firebaseConfig = {
    apiKey: "AIzaSyDwvtAXFUU4pd79JheFPY-Co6rfkUl8GUs",
    authDomain: "kedem-anvil.firebaseapp.com",
    projectId: "kedem-anvil",
    storageBucket: "kedem-anvil.firebasestorage.app",
    messagingSenderId: "229937316828",
    appId: "1:229937316828:web:227b8fd192641b162f4519"
};
export const APP_ID = firebaseConfig.appId; 

// Initialize Firebase App, Firestore, and Auth
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

export let currentUserId = null;
export let isEditor = false; 
export let allowedEditorUids = []; 

// Function to fetch allowed editor UIDs from Firestore
async function fetchAllowedEditorUids() {
    try {
        const editorDocRef = doc(db, 'app_config', 'editor_settings');
        const docSnap = await getDoc(editorDocRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            allowedEditorUids = data.allowedUids || [];
            console.log("Allowed editor UIDs fetched:", allowedEditorUids);
        } else {
            console.warn("Editor settings document (app_config/editor_settings) not found in Firestore. No UIDs whitelisted for editing.");
            allowedEditorUids = [];
        }
    } catch (error) {
        console.error("Error fetching allowed editor UIDs:", error);
        allowedEditorUids = [];
    }
}

// Authenticate and set up auth state listener
onAuthStateChanged(auth, async (user) => {
    // Fetch allowed editor UIDs every time auth state changes to keep it updated
    await fetchAllowedEditorUids(); 

    if (user) {
        currentUserId = user.uid;
        // Check if the current user's UID is in the fetched allowedEditorUids list
        isEditor = allowedEditorUids.includes(currentUserId);
        console.log(`User ${user.email || user.uid} logged in. Is editor: ${isEditor}`);
    } else {
        currentUserId = null;
        isEditor = false; // Not logged in, so not an editor
        console.log("User logged out or not authenticated.");
    }
    // Dispatch a custom event once auth and editor status is ready, for other modules to react
    document.dispatchEvent(new CustomEvent('authReady', { 
        detail: { 
            userId: currentUserId, 
            db: db, 
            auth: auth, 
            isEditor: isEditor 
        } 
    }));
});

// Export sign-in/sign-out functions for UI to use
export async function signInUser(email, password) {
    try {
        await signInWithEmailAndPassword(auth, email, password);
        return { success: true };
    } catch (error) {
        console.error("Error signing in:", error.code, error.message);
        let errorMessage = "An unknown error occurred.";
        switch (error.code) {
            case "auth/invalid-email":
                errorMessage = "Invalid email format.";
                break;
            case "auth/user-disabled":
                errorMessage = "This account has been disabled.";
                break;
            case "auth/user-not-found":
            case "auth/wrong-password":
                errorMessage = "Invalid email or password.";
                break;
            case "auth/invalid-credential": // For newer Firebase versions with passwordless/identity
                errorMessage = "Invalid email or password.";
                break;
            default:
                errorMessage = error.message;
        }
        return { success: false, error: errorMessage };
    }
}

export async function signOutUser() {
    try {
        await signOut(auth);
        return { success: true };
    } catch (error) {
        console.error("Error signing out:", error.message);
        return { success: false, error: error.message };
    }
}
