//Firebase configuration
import firebase from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import "https://www.gstatic.com/firebasejs/9.4.0/firebase-storage.js";
const firebaseConfig = {
    apiKey: "AIzaSyAMNRdeSeupmt3q-pfRJ6slzQZsMDwwKT0",
    authDomain: "passenger-95dd3.firebaseapp.com",
    databaseURL: "https://passenger-95dd3-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "passenger-95dd3",
    storageBucket: "passenger-95dd3.appspot.com",
    messagingSenderId: "263648786960",
    appId: "1:263648786960:web:4d39c863d96a5b3974e895"
  };

 firebase.initializeApp(firebaseConfig)
 const storage = firebase.storage()
 export { storage, firebase }