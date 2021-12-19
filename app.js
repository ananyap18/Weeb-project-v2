const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes")
const postRoutes = require('./routes/postRoutes')
const commentRoutes = require('./routes/commentRoutes')
const userRoutes = require('./routes/userRoutes')
const cookieParser = require('cookie-parser')
const { checkUser } = require('./middleware/authMiddleware')
const path = require('path')
require('dotenv').config()


const app = express()
const http = require('http')
const cors = require('cors')
const { Server } = require('socket.io')
const server = http.createServer(app)

// middleware
// app.use(express.static("public"))
app.use(express.json())
app.use(express.urlencoded())
app.use(cookieParser())
app.use(cors())

// socket.io configuration
const io = new Server(server,{
  cors: {
    origin: "http://localhost:3000",
    methods: ['GET', 'POST'],
  }
})

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`)

  socket.on("join_room",(roomId) => {
    socket.join(roomId)
    console.log(`user with id: ${socket.id} joined room id: ${roomId}`)
  })
  
  socket.on("send_message", (Msgdata) => {
    socket.to(Msgdata.room).emit("recieve_message", Msgdata)
  })  

  socket.on("disconnect", () => {
    console.log("User Disconnected: ", socket.id)
  })
})

// routes
app.get('*', checkUser)
app.use(userRoutes)
app.use(authRoutes);
app.use(postRoutes);
app.use(commentRoutes)

const port = process.env.PORT || 8000

// Server Static in production
if(process.env.NODE_ENV === 'production'){
  // set static folder
  app.use(express.static('client/build'))

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  })
}

// database connection
const dbURI = process.env.DB_URI;
mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then((result) => {
    console.log('mongoose connected')
    server.listen(port, () => {
      console.log(`Listening at port ${port}`);
    })
  }
  )
  .catch((err) => console.log(err));


