// firebase-init.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

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
const initialAuthToken = null; 

// Initialize Firebase App, Firestore, and Auth
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

export let currentUserId = null;
export let isAuthReady = false;

// Authenticate and set up auth state listener
onAuthStateChanged(auth, async (user) => {
    if (user) {
        currentUserId = user.uid;
    } else {
        if (initialAuthToken) {
            try {
                await signInWithCustomToken(auth, initialAuthToken);
                currentUserId = auth.currentUser.uid;
            } catch (error) {
                console.error("Error signing in with custom token:", error);
                await signInAnonymously(auth); 
                currentUserId = auth.currentUser.uid;
            }
        } else {
            await signInAnonymously(auth);
            currentUserId = auth.currentUser.uid;
        }
    }
    isAuthReady = true;
    // Dispatch a custom event once auth is ready, so other modules can react
    document.dispatchEvent(new CustomEvent('authReady', { detail: { userId: currentUserId, db: db, auth: auth } }));
});
