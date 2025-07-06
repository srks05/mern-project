// const express = require('express');
// const http = require('http');
// const socketIo = require('socket.io');
// const cors = require('cors');

// // Set up the Express app and HTTP server
// const app = express();
// const server = http.createServer(app);
// const io = socketIo(server, {
//   cors: {
//     origin: "http://localhost:3000",  // React app URL
//     methods: ["GET", "POST"],
//     allowedHeaders: ["Content-Type"],
//     credentials: true
//   }
// });

// // Keep track of users in the chatroom
// let users = [];

// // Serve a basic route
// app.get('/', (req, res) => res.send('Chatroom server is running'));

// // Socket.io connection
// io.on('connection', (socket) => {
//   console.log('A user connected');

//   // Send the current list of users and the number of active users
//   io.emit('activeUsers', users.length);

//   // When a new user joins, add them to the users list and notify others
//   socket.on('joinChat', (userName) => {
//     users.push({ id: socket.id, name: userName });
//     io.emit('activeUsers', users.length); // Update active users count
//     io.emit('chatMessage', `${userName} has joined the chat!`); // Send a message to all
//   });

//   // Listen for new chat messages and broadcast them
//   socket.on('sendMessage', (message, userName) => {
//     io.emit('chatMessage', `${userName}: ${message}`); // Broadcast message to all
//   });

//   // Remove user when they disconnect
//   socket.on('disconnect', () => {
//     const userIndex = users.findIndex(user => user.id === socket.id);
//     if (userIndex !== -1) {
//       const userName = users[userIndex].name;
//       users.splice(userIndex, 1);
//       io.emit('activeUsers', users.length); // Update active users count
//       io.emit('chatMessage', `${userName} has left the chat!`); // Notify others
//     }
//   });
// });

// // Start the server
// const PORT = 4646;
// server.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });
