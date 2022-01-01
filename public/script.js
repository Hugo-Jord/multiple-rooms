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
        video.style.width = '200px';
        video.style.height = '200px';
        video.style.marginLeft = '100px'
        video.style.marginTop = '100px'
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
    video.style.width = '200px'
    video.style.height = '200px'
    video.style.marginLeft = '100px'
    video.style.marginTop = '100px'
    call.on('stream', userVideoStream => { //when new user, add their video
        addVideoStream(video, userVideoStream)

    })
    call.on('close', () => { //if user leaves, close video
        video.remove()
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
    button2.style.display = 'inline-block'
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
    button2.style.display = 'inline-block'
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
