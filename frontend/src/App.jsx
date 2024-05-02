import { Container, Stack, TextField, Typography } from "@mui/material"
import React, { useEffect, useMemo, useState } from "react"
import { io } from "socket.io-client"

const App = () => {

  const socket = useMemo(() => io('http://localhost:3000'), [])

  const [message, setMessage] = useState("");
  const [room, setRoom] = useState('');
  const [socketId, setSocketId] = useState("");
  const [messageList, setMessageList] = useState([])

  useEffect(() => {
    socket.on("connect", () => {
      setSocketId(socket.id)
      console.log(socket)
      console.log("connected to socket ---> ", socket.id)
    })

    socket.on("recieved-message", (data) => {
      console.log(data)
      setMessageList((message) => [...message, data])
    })

    socket.on("welcome", (s) => {
      console.log(s)
    })
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("message", { message, room })

  }


  return (
    <div><Container maxWidth="sm">
      <Typography variant="h1" component="div" gutterBottom>
        Welcome to socket.io
      </Typography>

      <Typography variant="h6" component="div" gutterBottom>
        {socketId}
      </Typography>



      <form onSubmit={handleSubmit}>
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
      </Stack>
    </Container></div>
  )

}
export default App