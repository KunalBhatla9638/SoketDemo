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
let count = 1;

function initializeSocket(io) {
  io.on("connection", (socket) => {
    console.log("Socket connected on --> ", socket.id);
    // console.log("All user array ---> ", users)
    // socket.emit("welcome", "Welcome to the server.")
    // socket.broadcast.emit(`Welcome, ${socket.id} joined the server.`)

    // socket.on("message", (data) => {
    //   const { from, message, to, id } = data;
    //   // console.log("data --> ", data);
    //   const senderID = users.find((item) => socket.id === item.socketID);
    //   console.log("Sender ID:", senderID.id);

    //   if (!data[senderID.id]) {
    //     // If not, create an empty array for the sender's ID
    //     data[senderID.id] = [];
    //   }
    //   data[senderID.id].push({ id, from, message, to });

    //   console.log("Messages Object ---->", data);
    //   console.log("******");

    //   // socket.broadcast.emit("recieved-message", data);
    //   io.to([from, to]).emit("recieved-message", data);
    // });

    const messages = {};
    socket.on("message", (data) => {
      const { from, message, to, id } = data;
      console.log("data --> ", data);

      const senderID = users.find((item) => socket.id === item.socketID);
      console.log("Sender ID:", senderID.id);

      // Check if the sender's ID already exists in the messages object
      if (!messages[senderID.id]) {
        // If not, create an empty array for the sender's ID
        messages[senderID.id] = [];
      }

      // Push the new message object to the array corresponding to the sender's ID
      messages[senderID.id].push({ id, from, message, to });

      // console.log("Messages Object:", messages);

      // Emit the received message to the recipient
      // io.to(to).emit("received-message", data);
      io.to([from, to]).emit("recieved-message", data);
    });

    socket.on("new-user", (obj) => {
      obj.socketID = socket.id;
      obj.id = count++;
      users.push(obj);
      // console.log("All user array ---> ", users)
      io.emit("all-users", users);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected --->", socket.id);
      const userIdx = users.findIndex((item) => item.socketID == socket.id);
      if (userIdx != -1) {
        count--;
        users.splice(userIdx, 1);
      }
      //   console.log(userIdx)
    });
  });
}

module.exports = initializeSocket;
