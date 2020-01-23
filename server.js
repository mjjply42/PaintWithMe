const express = require('express')
const utils = require('./client/src/utils/functions.js')
const bodyParser= require('body-parser')
const path = require('path')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
let nameSpaces = []
const nameSpace = io.of('/555')
nameSpaces.push(nameSpace)

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
        res.send(socketID)
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

nameSpaces.forEach((nsp, index) => {
    nsp.on('connection', (socket) => {
        console.log('a user connected');
        socket.on('send-grid', (received) => {
            socket.broadcast.emit('updated-grid', received);
        })
    })
})
const port = process.env.PORT || 5000;

http.listen(port, () => console.log(`Server Started on port ${port}`));