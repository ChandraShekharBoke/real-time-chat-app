require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const path = require('path');
const { Server } = require('socket.io');
const connectDB = require('./Config/db');
const Message = require('./model/Message');
const { format } = require('date-fns');

const users = new Map();

const getUsersInRoom = (room) => {
    const usersInRoom = [];
    users.forEach((user) => {
        if (user.room === room) {
            usersInRoom.push({ username: user.username, socketId: user.socketId });
        }
    });
    return usersInRoom;
};

const app = express();

app.use(cors({
    origin: "http://localhost:3000"
}));

app.use(express.static(path.join(__dirname, '../client/build'))); 

app.get('/{*path}', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ['GET', 'POST']
    }
});

io.on('connection', (socket) => {
    console.log('New user connected:', socket.id);

    socket.on('join', async ({ username, room }) => {
        console.log(`${username} joined room: ${room}`);
        socket.join(room);
        users.set(socket.id, { username, room, socketId: socket.id });

        const messages = await Message.find({ room: room })
            .sort({ createdAt: 1 })
            .limit(50);

        socket.emit('chatHistory', messages);

        socket.emit('message', {
            username: 'System',
            text: `Welcome to ${room}, ${username}!`,
            time: new Date().toLocaleTimeString()
        });

        socket.to(room).emit('message', {
            username: 'System',
            text: `${username} has joined the room!`,
            time: new Date().toLocaleTimeString()
        });

        io.to(room).emit('roomData', {
            room: room,
            users: getUsersInRoom(room)
        });
    });

    socket.on('sendMessage', async ({ message }) => {
        const user = users.get(socket.id);

        const messageData = {
            room: user.room,
            username: user.username,
            text: message,
            time: format(new Date(), 'hh:mm a')
        };

        const newMessage = new Message(messageData);
        await newMessage.save();

        console.log(`Message from ${user.username}: ${message}`);

        io.to(user.room).emit('message', messageData);
    });

    socket.on('typing', ({ room, username }) => {
        socket.to(room).emit('userTyping', { username });
    });

    socket.on('stopTyping', ({ room }) => {
        socket.to(room).emit('userStopTyping');
    });

    socket.on('privateMessage', ({ to, from, text, time }) => {
        console.log(`Private message from ${from} to ${to}`);

        io.to(to).emit('privateMessage', {
            username: from,
            text: text,
            time: time
        });

        socket.emit('privateMessage', {
            username: from,
            text: text,
            time: time
        });
    });

    socket.on('disconnect', () => {
        const user = users.get(socket.id);
        if (user) {
            socket.to(user.room).emit('message', {
                username: 'System',
                text: `${user.username} has left the room.`,
                time: new Date().toLocaleTimeString()
            });
            users.delete(socket.id);

            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            });
        }
        console.log('User disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 5000;

connectDB();

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});