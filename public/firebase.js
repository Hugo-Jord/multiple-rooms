//Firebase configuration
import {initializeApp} from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import {getStorage, ref as sRef, uploadBytesResumable, getDownloadURL} from "https://www.gstatic.com/firebasejs/9.4.0/firebase-storage.js";
const firebaseConfig = {
    apiKey: "AIzaSyAMNRdeSeupmt3q-pfRJ6slzQZsMDwwKT0",
    authDomain: "passenger-95dd3.firebaseapp.com",
    databaseURL: "https://passenger-95dd3-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "passenger-95dd3",
    storageBucket: "passenger-95dd3.appspot.com",
    messagingSenderId: "263648786960",
    appId: "1:263648786960:web:4d39c863d96a5b3974e895"
  };

const app = initializeApp(firebaseConfig)
const storage = getStorage(app)

//Event listener when photo is taken
//Now it shall be uploaded to storage
document.getElementById("yes").addEventListener("click", sendToStorage);
function sendToStorage() {
  const file = document.querySelector('#file')
  const image = file[0]
  console.log(image)
  console.log(image.name)
  //const storage_ref = sRef(storage, "Images/")
}
