import { Container, Stack, TextField, Typography } from "@mui/material";
// import { Container, Row, Col, Form, Button, ListGroup } from 'react-bootstrap';
import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { io } from "socket.io-client";

const HomePage = () => {
  const socket = useMemo(() => io("http://localhost:3000"), []);

  const { state } = useLocation();
  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [socketId, setSocketId] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    socket.on("connect", () => {
      setSocketId(socket.id);
      console.log(socket);
      console.log("connected to socket ---> ", socket.id);
    });

    socket.on("recieved-message", (data) => {
      console.log(data);
      setMessageList((message) => [...message, data]);
    });

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
    socket.emit("message", { message, room });
  };

  const handleTalkClick = (sid) => {
    console.log(sid);
  };

  return (
    <div>
      <Container maxWidth="sm">
        <Typography variant="h4" component="div" gutterBottom>
          Welcome {state.username}
        </Typography>

        <Typography variant="h6" component="div" gutterBottom>
          {socketId}
        </Typography>

        {allUsers.map((item) => {
          console.log(item);

          return (
            <div className="d-flex" key={item.socketID}>
              <h4>
                {item.socketID != socketId
                  ? item.user.username
                  : item.user.username + " (You)"}
              </h4>
              <button
                onClick={() => {
                  handleTalkClick(item.socketID);
                }}
              >
                Talk
              </button>
            </div>
          );
        })}

        {/* <form onSubmit={handleSubmit}>
          <TextField value={message} id="uniq1" label='Message' variant="outlined" onChange={e => setMessage(e.target.value)} />
          <TextField value={room} id="uniq2" label='Room' variant="outlined" onChange={e => setRoom(e.target.value)} />
          <button type="submit">Click</button>
  
        </form>
  
        <Stack>
          {
            messageList.map((m, i) => {
              console.log(messageList)
              return (
                <Typography variant="h6" component="div" gutterBottom key={i}>
                  {m.message}
                </Typography>
              )
            })
          }
        </Stack> */}
      </Container>
    </div>
  );
};

export default HomePage;
