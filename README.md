# Real-Time Chat Application

A full-stack real-time chat application built with the MERN stack and Socket.io.

## Features

- Real-time messaging with WebSockets (Socket.io)
- Multiple chat rooms (General, Gaming, Music)
- Live online users list
- Typing indicators
- Private messaging (one-on-one)
- Chat history with MongoDB
- Message timestamps

## Tech Stack

**Frontend:** React, React Router, Socket.io-client, date-fns

**Backend:** Node.js, Express, Socket.io, MongoDB, Mongoose

## Getting Started

### Prerequisites
- Node.js
- MongoDB

### Installation

1. Clone the repo
```bash
   git clone https://github.com/yourusername/chat-app.git
   cd chat-app
```

2. Install dependencies
```bash
   # Root
   npm install

   # Server
   cd server && npm install

   # Client
   cd ../client && npm install
```

3. Create `.env` file in server folder