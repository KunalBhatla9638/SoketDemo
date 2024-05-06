import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { io } from "socket.io-client";
import "./HomePage.css";

const HomePage = () => {
  const socket = useMemo(() => io("http://localhost:3000"), []);
  const [selectedContact, setSelectedContact] = useState(null);

  //added
  const { state } = useLocation();
  const [message, setMessage] = useState("");
  const [socketId, setSocketId] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [displayTalkFormCard, setDisplayTalkFormCard] = useState(false);

  const [sid, setSId] = useState("");
  const [showChats, setShowChats] = useState(false);

  useEffect(() => {
    socket.on("connect", () => {
      setSocketId(socket.id);
      console.log(socket);
      console.log("connected to socket ---> ", socket.id);
    });

    socket.on("recieved-message", (data) => {
      console.log(data);
      data.sender = data.from == socket.id ? "user" : "contact";
      setMessageList((message) => [...message, data]);
    });

    // New ONE
    // socket.on("recieved-message", (data) => {
    //   console.log("data--->", data);
    //   data.sender = data[0].from == socket.id ? "user" : "contact";
    //   setMessageList((message) => [...message, data]);
    // });

    socket.emit("new-user", { user: state });

    socket.on("all-users", (data) => {
      // console.log(data)
      setAllUsers(data);
    });

    socket.on("welcome", (s) => {
      console.log(s);
    });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setDisplayTalkFormCard(false);
    setMessage("");
    socket.emit("message", { message, from: socketId, to: sid });
  };

  const handleTalkClick = (id, sid, user, obj) => {
    console.log(sid, user);
    setSId(sid);
    setSelectedContact(user);
    setShowChats(true);
    obj.userName = user;
    setSelectedContact(obj);
    setDisplayTalkFormCard(true);
  };

  // NEW ONE
  // const [userID, setUserID] = useState("");
  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   setDisplayTalkFormCard(false);
  //   setMessage("");
  //   socket.emit("message", { id: userID, message, from: socketId, to: sid });
  // };

  // const handleTalkClick = (id, sid, user, obj) => {
  //   console.log(obj, id, sid, user);
  //   setSId(sid);
  //   setUserID(id);
  // obj.userName = user;
  // setSelectedContact(obj);
  //   setShowChats(true);
  //   console.log(obj);
  //   setDisplayTalkFormCard(true);
  // };

  const contacts = [
    { id: 1, name: "John Doe" },
    { id: 2, name: "Jane Smith" },
    { id: 3, name: "Alice Johnson" },
  ];

  const messages = {
    1: [
      { id: 1, content: "Hey, how's it going?", sender: "user" },
      { id: 2, content: "Not bad, you?", sender: "contact" },
    ],
    2: [
      { id: 1, content: "Hello there!", sender: "contact" },
      { id: 2, content: "Hi! How can I help you?", sender: "user" },
    ],
    3: [
      { id: 1, content: "Hello there!", sender: "contact" },
      { id: 1, content: "Hello there!", sender: "contact" },
      { id: 1, content: "Hello there!", sender: "contact" },
      { id: 1, content: "Hello there!", sender: "contact" },
      { id: 2, content: "Hello there!", sender: "user" },
    ],
  };

  // const handleContactClick = (contact) => {
  //   console.log("contact --> ", contact);
  //   setSelectedContact(contact);
  // };

  // const sendMessage = () => {
  //   if (message.trim() === "") return;
  //   const newMessage = {
  //     id: messages[selectedContact.id].length + 1,
  //     content: message,
  //     sender: "user",
  //   };
  //   setMessage("");
  //   messages[selectedContact.id].push(newMessage);
  // };

  return (
    <div className="container">
      <div className="contact-list">
        {allUsers.map((item) => {
          const user =
            item.socketID != socketId
              ? item.user.username
              : item.user.username + " (You)";
          return (
            <div
              key={item.socketID}
              className={`contact-item
              ${
                selectedContact && selectedContact.id === null //contact.id
                  ? "active"
                  : ""
              }
              `}
              // onClick={() => handleTalkClick(item.socketID, user)}
              // NEWADDedd
              onClick={() => {
                handleTalkClick(item.id, item.socketID, user, item);
              }}
            >
              {user}
            </div>
          );
        })}
      </div>
      <div className="chat-container">
        {showChats && (
          <>
            <div className="chat-header">
              {selectedContact?.userName == ""
                ? "Loading..."
                : selectedContact.userName}
            </div>
            <div className="message-list">
              {/* {messages[selectedContact.id].map((message) => {
                console.log(message);
                return (
                  // <div
                  //   key={message.id}
                  //   className={`message ${
                  //     message.sender === "user" ? "sent" : "received"
                  //   }`}
                  // >
                  //   {message.content}
                  // </div>
                  <p>demo</p>
                );
              })} */}
              {messageList.map((message, i) => {
                console.log(message);
                return (
                  <div
                    key={i}
                    className={`message ${
                      message.sender === "user" ? "sent" : "received"
                    }`}
                  >
                    {message.message}
                  </div>
                );
              })}
            </div>
            <div className="message-input-container">
              <input
                type="text"
                className="message-input"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button className="send-button" onClick={handleSubmit}>
                Send
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default HomePage;

// import { Container, Stack, TextField, Typography } from "@mui/material";
// // import { Container, Row, Col, Form, Button, ListGroup } from 'react-bootstrap';
// import React, { useEffect, useMemo, useState } from "react";
// import { useLocation } from "react-router-dom";
// import { io } from "socket.io-client";

// const HomePage = () => {
//   const socket = useMemo(() => io("http://localhost:3000"), []);

//   const { state } = useLocation();
//   const [message, setMessage] = useState("");
//   // const [room, setRoom] = useState("");
//   const [socketId, setSocketId] = useState("");
//   const [messageList, setMessageList] = useState([]);
//   const [allUsers, setAllUsers] = useState([]);
//   const [displayTalkFormCard, setDisplayTalkFormCard] = useState(false);
//   const [sid, setSId] = useState("");

//   useEffect(() => {
//     socket.on("connect", () => {
//       setSocketId(socket.id);
//       console.log(socket);
//       console.log("connected to socket ---> ", socket.id);
//     });

//     socket.on("recieved-message", (data) => {
//       console.log("data--->", data);
//       data.sender = data.from == socket.id ? "user" : "contact";
//       setMessageList((message) => [...message, data]);
//     });

//     socket.emit("new-user", { user: state });

//     socket.on("all-users", (data) => {
//       // console.log(data)
//       setAllUsers(data);
//     });

//     socket.on("welcome", (s) => {
//       console.log(s);
//     });
//   }, []);

//   const [userID, setUserID] = useState("");
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setDisplayTalkFormCard(false);
//     setMessage("");
//     socket.emit("message", { id: userID, message, from: socketId, to: sid });
//   };

//   const handleTalkClick = (id, sid, user) => {
//     console.log(id, sid, user);
//     setSId(sid);
//     setUserID(id);
//     setDisplayTalkFormCard(true);
//   };

//   return (
//     <div>
//       <Container maxWidth="sm">
//         <Typography variant="h4" component="div" gutterBottom>
//           Welcome {state.username}
//         </Typography>

//         <Typography variant="h6" component="div" gutterBottom>
//           {socketId}
//         </Typography>

//         {allUsers.map((item) => {
//           // console.log(item);
//           // console.log(item);
//           return (
//             <div className="d-flex" key={item.socketID}>
//               <h4>
//                 {item.socketID != socketId
//                   ? item.user.username
//                   : item.user.username + " (You)"}
//               </h4>
//               <button
//                 onClick={() => {
//                   handleTalkClick(item.id, item.socketID, item.user.username);
//                 }}
//                 onDoubleClick={() => setDisplayTalkFormCard(false)}
//               >
//                 Talk
//               </button>
//             </div>
//           );
//         })}

//         {displayTalkFormCard && (
//           <form onSubmit={handleSubmit}>
//             <TextField
//               value={message}
//               id="uniq1"
//               label="Message"
//               variant="outlined"
//               onChange={(e) => setMessage(e.target.value)}
//             />
//             {/* <TextField
//           value={room}
//           id="uniq2"
//           label="Room"
//           variant="outlined"
//           onChange={(e) => setRoom(e.target.value)}
//         /> */}
//             <button type="submit">Click</button>
//           </form>
//         )}
//         <Stack>
//           {messageList.map((m, i) => {
//             // console.log("m --> ", m);
//             return (
//               <Typography variant="h6" component="div" gutterBottom key={i}>
//                 {m.message}
//               </Typography>
//             );
//           })}
//         </Stack>
//       </Container>
//     </div>
//   );
// };

// export default HomePage;
