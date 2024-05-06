// const socketIO = require('socket.io');

// let io;

// function initializeSocket(server) {
//     io = socketIO(server);

//     io.on('connection', (socket) => {
//         console.log('A user connected');

//         // Handle events here
//         socket.on('disconnect', () => {
//             console.log('User disconnected');
//         });
//     });
// }

// function getIO() {
//     if (!io) {
//         throw new Error('Socket.io is not initialized');
//     }
//     return io;
// }

// module.exports = {
//     initializeSocket,
//     getIO
// };

let users = [];

function initializeSocket(io) {
  io.on("connection", (socket) => {
    console.log("Socket connected on --> ", socket.id);
    // console.log("All user array ---> ", users)
    // socket.emit("welcome", "Welcome to the server.")
    // socket.broadcast.emit(`Welcome, ${socket.id} joined the server.`)

    socket.on("message", (data) => {
      const { room, message } = data;
      console.log(data);
      // socket.broadcast.emit("recieved-message", data);
      io.to(room).emit("recieved-message", data);
    });

    socket.on("new-user", (obj) =>{
        obj.socketID = socket.id;
        users.push(obj)
        // console.log("All user array ---> ", users)
        io.emit("all-users", users);
    })

    socket.on("disconnect", () => {
      console.log("User disconnected --->", socket.id);
      const userIdx = users.findIndex((item) => item.socketID == socket.id)
      if(userIdx != -1){
        users.splice(userIdx, 1)
      }
    //   console.log(userIdx)
    });
  });
}

module.exports = initializeSocket;
