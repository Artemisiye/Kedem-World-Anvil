// firebase-init.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js"; // Removed signInAnonymously
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
export let isEditor = false; // New variable to track editor status
export let allowedEditorUids = []; // To store the list fetched from Firestore

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
            console.warn("Editor settings document not found in Firestore. No UIDs whitelisted.");
            allowedEditorUids = [];
        }
    } catch (error) {
        console.error("Error fetching allowed editor UIDs:", error);
        allowedEditorUids = [];
    }
}

// Authenticate and set up auth state listener
onAuthStateChanged(auth, async (user) => {
    // Fetch allowed editor UIDs every time auth state changes, or once on init
    // This needs to happen before setting isEditor
    await fetchAllowedEditorUids(); 

    if (user) {
        currentUserId = user.uid;
        isEditor = allowedEditorUids.includes(currentUserId);
        console.log(`User ${user.email} (${currentUserId}) logged in. Is editor: ${isEditor}`);
    } else {
        currentUserId = null;
        isEditor = false;
        console.log("User logged out or not authenticated.");
        // If you strictly want non-anonymous access, you might redirect to a login page here
        // For now, app will just show restricted content.
    }
    // Dispatch a custom event once auth and editor status is ready
    document.dispatchEvent(new CustomEvent('authReady', { 
        detail: { 
            userId: currentUserId, 
            db: db, 
            auth: auth, 
            isEditor: isEditor 
        } 
    }));
});

// Export sign-in/sign-out functions for UI
export async function signInUser(email, password) {
    try {
        await signInWithEmailAndPassword(auth, email, password);
        console.log("Signed in successfully!");
        return { success: true };
    } catch (error) {
        console.error("Error signing in:", error.message);
        return { success: false, error: error.message };
    }
}

export async function signOutUser() {
    try {
        await signOut(auth);
        console.log("Signed out successfully!");
        return { success: true };
    } catch (error) {
        console.error("Error signing out:", error.message);
        return { success: false, error: error.message };
    }
}
