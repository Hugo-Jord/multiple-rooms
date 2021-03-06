window.onload = function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.watchPosition(showPosition);
  } else {
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
};
let lat;
let long;
// coordenadas da posição atual do utilizador
function showPosition(position) {
  lat = position.coords.latitude;
  long = position.coords.longitude;
}

//Firebase configuration
import {initializeApp} from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import {getStorage, ref as sRef, uploadBytesResumable, getDownloadURL} from "https://www.gstatic.com/firebasejs/9.4.0/firebase-storage.js";
import {getFirestore, doc, getDoc, setDoc, collection, addDoc} from "https://www.gstatic.com/firebasejs/9.4.0/firebase-firestore.js";
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
const firestore = getFirestore(app)

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
  const room = document.getElementsByClassName("tbd")[0]
  var image = fileToUpload

  const metadata = {
    contentType: image.type
  }
  
  var storage_ref = sRef(storage, "Images/"+room.id+"/"+image.name)
  var task = uploadBytesResumable(storage_ref, image, metadata)

  task.on('state-changed', (snapshot)=>{
    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  },
  (error)=>{
    alert("error: image not uploaded");
  },
  () => {
    getDownloadURL(task.snapshot.ref).then((downloadURL) => {
      console.log(downloadURL)
      saveURLtoFirestore(downloadURL)
    })
  })

}

//Upload reference to firestore database
async function saveURLtoFirestore(url){
  var ref = doc(firestore, "ImageLinks/"+fileToUpload.name)

  await setDoc(ref, {
    ImageName: fileToUpload.name,
    ImageUrl: url,
    Imglat: lat,
    Imglong: long
  })

}