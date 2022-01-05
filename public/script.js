//Firebase configuration
import firebase from "firebase/app"
import "firebase/storage"
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

//to run port 3001 do Set-ExecutionPolicy RemoteSigned on windows powershell
//when done do Set-ExecutionPolicy Restricted
const socket = io('/') //socket connects to root path
const videoGrid = document.getElementById('video-grid') //video ref

//create peer server connection
const myPeer = new Peer(undefined, {
    key: 'peerjs',
    secure: true, 
    host: 'young-plateau-05468.herokuapp.com',
    port: 443
})
const myVideo = document.createElement('video')
myVideo.muted = true //muting our audio to ourselves

const peers = {}
const peers_vids = {}
var user

navigator.mediaDevices.getUserMedia({
    video: true, //passing our video and audio to peers
    audio: true
}).then(stream => {
    addVideoStream(myVideo, stream);

    myPeer.on('call', call => {
        call.answer(stream)

        var video = document.createElement('video')
        myVideo.style.width = '200px'
        myVideo.style.height = '200px'
        myVideo.style.left = '37%'
        myVideo.style.zIndex = '2'
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream)
        })

        peers[1] = call
        peers_vids[1] = video
        
    })

    socket.on('user-connected', userId => {
        setTimeout(connectToNewUser,1000,userId,stream)
        //connectToNewUser(userId, stream);
    })
})


socket.on('user-disconnected', userId => {
    if(peers[userId]) peers[userId].close();
    if(peers[1]){
        peers_vids[1].remove();
        peers[1].close();
        myVideo.style.width = '350px'
        myVideo.style.height = '640px'
        myVideo.style.left = '0%'
    }
})

//as soon as we connect with our peer this runs
myPeer.on('open', id => {
    user = id;
    socket.emit('join-room', ROOM_ID, id);
})
 

function connectToNewUser(userId, stream) {
    const call = myPeer.call(userId, stream)

    const video = document.createElement('video')
    myVideo.style.width = '200px'
    myVideo.style.height = '200px'
    myVideo.style.left = '37%'
    myVideo.style.zIndex = '2'
    call.on('stream', userVideoStream => { //when new user, add their video
        addVideoStream(video, userVideoStream)

    })
    call.on('close', () => { //if user leaves, close video
        video.remove()
        myVideo.style.width = '350px'
        myVideo.style.height = '640px'
        myVideo.style.left = '0%'
    })

    peers[userId] = call
    peers_vids[userId] = video
}

//associating video object with a stream
function addVideoStream(video, stream){
    video.srcObject = stream
    video.addEventListener('loadedmetadata', () => {
        video.play()
    })
    videoGrid.append(video)
}


//pausing the video stream
function pauseVideo(){
    myVideo.pause()
    socket.emit('user-paused', user)

    const button = document.getElementById('pause')
    button.style.display = 'none'

    const button2 = document.getElementById('unpause')
    button2.style.display = 'block'
}

//pausing the peers video stream if it clicked on pause
socket.on('peer-paused', user => {
    if(peers_vids[user]){
        peers_vids[user].pause()
    }
    if(peers[1]){
        peers_vids[1].pause();
    }
})

//unpausing video stream
function unpauseVideo(){
    myVideo.play()
    socket.emit('user-unpaused', user)

    const button = document.getElementById('unpause')
    button.style.display = 'none'

    const button2 = document.getElementById('pause')
    button2.style.display = 'block'
}

//unpausing the peers video stream if it clicked on pause
socket.on('peer-unpaused', user => {
    if(peers_vids[user]){
        peers_vids[user].play()
    }
    if(peers[1]){
        peers_vids[1].play();
    }
})

function gotoChat(){
    location.replace("https://radiant-forest-87782.herokuapp.com")
}

//photo
const img = document.createElement('img')
const files = document.querySelector('#file')
const container = document.getElementById("photo-container")

files.addEventListener('change', function() {
    const chosenFile = this.files[0];

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

function hide(){
    container.style.display = "none";
}

socket.on('peer-sent-photo', () => {
    const alert = document.getElementById("photo-alert")
    alert.style.display = "block"
})

function sendToFirebase(){
    //send to firebase code 
    //...
    const image = document.getElementById("imageToUpload");
    console.log(image)


    container.style.display = "none";
    socket.emit("new-photo-added")
}

function closeAlert(){
    const alert = document.getElementById("photo-alert")
    alert.style.display = "none";
}