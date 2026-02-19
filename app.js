const express = require('express');
const app = express();
const path = require('path');
const http = require('http');

const socketIo = require('socket.io');

const server = http.createServer(app);
const io = socketIo(server);

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname,'public')));

io.on('connection', (socket) => {
    socket.on('send-location', (data) => {
        io.emit('update-location', {id: socket.id, latitude: data.latitude, longitude: data.longitude});
    });

    console.log('a user connected');
    socket.on('disconnect', (id) => {
        io.emit('a user disconnected', id);
    });
});

app.get("/", (req, res) => {
  res.render("index");
});

server.listen(3000);