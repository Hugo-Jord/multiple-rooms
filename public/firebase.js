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
const img = document.createElement('img')
const files = document.querySelector('#file')
const container = document.getElementById("photo-container")
var fileToUpload;

files.addEventListener('change', function() {
    const chosenFile = this.files[0];
    fileToUpload = chosenFile;

    if(chosenFile) {
        const reader = new FileReader();
        reader.addEventListener('load', function() {
            img.setAttribute('src', reader.result);
        });
        reader.readAsDataURL(chosenFile);
    }
    img.style.width="280px";
    img.style.height="280px";
    img.style.left="0"; 
    img.style.right= "0"; 
    img.style.marginLeft= "auto"; 
    img.style.marginRight= "auto";
    img.style.position="absolute";
    img.setAttribute("id", "imageToUpload")
    container.appendChild(img)
    container.style.display = "block";
});

//Now it shall be uploaded to storage
document.getElementById("yes").addEventListener("click", sendToStorage);
function sendToStorage() {
  var image = fileToUpload
  //console.log(image)
  //console.log(image.name)
  
  var storage_ref = sRef(storage, "Images/"+image.name)
  var task = storage_ref.put(image)
}
