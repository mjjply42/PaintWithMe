const express = require('express')
const utils = require('./client/src/utils/functions.js')
const bodyParser= require('body-parser')
const path = require('path')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
let connected = 0
const nameSpace = io.of('/500')

const createNameSpace = (req, res, next) => {
    let socketID = 0
    app.get('/createNewSocket', (req, res) => {
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS, POST')
        //res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')
        res.setHeader('Access-Control-Allow-Credentials', true)
        //if (await socketDoesntExist())
        //    socketID = createNewSocketId()
        socketID = utils.createNewSocketId()
        res.json({socket: `/${socketID}`})
    })
    next()
}

//Body Parser Middleware
app.use(bodyParser.json());
app.use('/createNewSocket',createNameSpace)
//Serve static assets if we are in production

if (process.env.NODE_ENV === 'production') {
    //Set a static folder
    app.use(express.static('client/build'));
    app.get('/*', (req, res, next) => {
        res.sendFile(path.resolve(__dirname,'client', 'build', 'index.html'));
        next()
    });
}

nameSpace.on('connection', (socket) => {
    connected++
    console.log('a user connected');
    socket.join('some room');
    socket.room = 'some room'
    socket.on('send-grid', (received) => {
        console.log(socket.room)
        socket.broadcast.to(socket.room).emit('some event', received);
        //socket.broadcast.emit('updated-grid', received);
    })
    socket.on('change_room', (newRoom) => {
        console.log("CHNAGING ROOM: ", newRoom)
        socket.leave(socket.room)
        socket.join(newRoom)
        socket.room = newRoom
    })
})
const port = process.env.PORT || 5000;

http.listen(port, () => console.log(`Server Started on port ${port}`));