const path = require('path')
const express = require('express')
const http = require('http')

const app = express()

const port = process.env.PORT || 5000

// Define paths for Express config
const publicDirPath = path.join(__dirname, 'client/build')

// Setup static directory to serve
app.use(express.static(publicDirPath))
app.use(express.json())

const httpServer = http.createServer(app);

const io = require("socket.io")(httpServer, {
    cors: {
        origin: "http://localhost:3000",
    },
});

const users = ["Bill Gates", "Elon Musk", "Jeff Bejos"]
// home route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'))
})
// users route
app.get('/users', (req, res) => {
    res.send({
        users
    })
})
// create-user route
app.post('/create-user', (req, res) => {
    console.log(req.body)
    res.send()
})

io.use((socket, next) => {
    const username = socket.handshake.auth.username;
    if (!username) {
        return next(new Error("invalid username"));
    }
    socket.username = username;
    next();
});

io.on('connection', socket => {
    console.log(`connect: ${socket.id}`);

     // fetch existing users
    const users = [];
    for (let [id, socket] of io.of("/").sockets) {
        users.push({
            userID: id,
            username: socket.username,
            messages: [],
            connected: true,
        });
    }
    socket.emit("users", users);

    // notify existing users
    socket.broadcast.emit("user connected", {
        userID: socket.id,
        username: socket.username,
        connected: true,
        messages: []
    });

    // console.log(`connect: ${socket.id}`);
    socket.on("private message", ({ content, to }) => {
        const message = {
            content,
            from: socket.id,
            to,
        };
        socket.to(to).emit("private message", message);
    });
    
    socket.on('disconnect', async () => {
        // notify users upon disconnection
        console.log(`disconnect: ${socket.id}`);

        // notify other users
        socket.broadcast.emit("user disconnected", socket.id);
    
    });
});


httpServer.listen(port, () => {
    console.log('Server is up on port ' + port)
})
