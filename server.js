//create a server to be used with socket.io
const express = require('express'); //create express server
const app = express(); //to run server
const server = require('http').Server(app);
const io = require('socket.io')(server);
const { v4: uuidV4 } = require('uuid')


//setup the express server
app.set('view engine', 'ejs');
app.use(express.static('public')); //all js and css goes in this public folder

//redirect user to a room
app.get('/', (req, res)  => {
    res.redirect(`/${uuidV4()}`)
})

//create a brand new room for user
app.get('/:room', (req, res)  => {
    res.render('room', { roomId: req.params.room })
})

//to run every time someone connects to the webpage
io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
        console.log(roomId, userId)

        socket.join(roomId)
        socket.to(roomId).emit("user-connected", userId)


        socket.on('user-paused', user => {
            socket.to(roomId).emit('peer-paused', user)
        })

        socket.on('user-unpaused', user => {
            socket.to(roomId).emit('peer-unpaused', user)
        })

        socket.on('disconnect', () => {
            socket.to(roomId).emit('user-disconnected', userId)
        })
    })
})

//make server in port 3000
server.listen(process.env.PORT || 3000);

