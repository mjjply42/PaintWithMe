const express = require('express')
const bodyParser= require('body-parser')
const path = require('path')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http);
const nsp = io.of('/turd')

//Body Parser Middleware
app.use(bodyParser.json());

//Serve static assets if we are in production
if (process.env.NODE_ENV === 'production') {
    //Set a static folder
    app.use(express.static('client/build'));
    app.get('/*', (req, res) => {
        res.sendFile(path.resolve(__dirname,'client', 'build', 'index.html'));
    });
}
nsp.on('connection', (client) => {
    console.log('a user connected');
    client.on('test-send', (test) => {
        client.broadcast.emit('test-response', test);
    })
});
const port = process.env.PORT || 5000;

http.listen(port, () => console.log(`Server Started on port ${port}`));