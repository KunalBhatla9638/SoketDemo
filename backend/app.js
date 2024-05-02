const express = require("express")
const { Server } = require('socket.io')
const { createServer } = require("http")
const cors = require("cors")

const port = 3000;

const app = express();
const server = createServer(app)

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ['GET', 'POST'],
        credentials: true
    }
})

app.use(cors({
    origin: "http://localhost:5173",
    methods: ['GET', 'POST'],
    credentials: true
}));

app.get("/", (req, res) => {
    res.send("Home")
})

io.on("connection", (socket) => {
    console.log("Socket connected on --> ", socket.id);
    // socket.emit("welcome", "Welcome to the server.")
    // socket.broadcast.emit(`Welcome, ${socket.id} joined the server.`)


    socket.on("message", (data) =>{
        const {room, message} = data;
        console.log(data)
        // socket.broadcast.emit("recieved-message", data);
        io.to(room).emit("recieved-message", data)
    })
    
})

server.listen(port, () => {
    console.log("Server is runnnnnning on ", port)
})