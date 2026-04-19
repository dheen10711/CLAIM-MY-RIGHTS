// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import { getAuth, setPersistence, browserLocalPersistence } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBpfuDQJKj78xQKfTUI7PNviOYdJRRzx0A",
  authDomain: "claimmyrights-bc3dd.firebaseapp.com",
  projectId: "claimmyrights-bc3dd",
  storageBucket: "claimmyrights-bc3dd.firebasestorage.app",
  messagingSenderId: "930085915585",
  appId: "1:930085915585:web:b7cc6e7dfa32df58cfbd40"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Set persistent login
setPersistence(auth, browserLocalPersistence)
  .then(() => console.log("Auth persistence set"))
  .catch(err => console.error("Persistence error:", err));

export { auth, db };

