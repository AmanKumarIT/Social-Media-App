const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const app = express();

// ✅ ADD YOUR FRONTEND URL HERE
const allowedOrigins = [
  "http://localhost:3000",
  "https://social-media-app-pfgk.vercel.app"
];

// ✅ UPDATED CORS (ONLY CHANGE)
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

const server = http.createServer(app);

// ✅ UPDATED SOCKET CORS (ONLY CHANGE)
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
  }
});

app.set('io', io);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));

io.on('connection', (socket) => {
  console.log('User connected', socket.id);
  socket.on('disconnect', () => {
    console.log('User disconnected', socket.id);
  });
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/posts', require('./routes/postRoutes'));

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server started on port ${PORT}`));


// const express = require('express');
// const dotenv = require('dotenv');
// const cors = require('cors');
// const http = require('http');
// const { Server } = require('socket.io');
// const connectDB = require('./config/db');

// dotenv.config();

// connectDB();

// const app = express();
// const server = http.createServer(app);

// const io = new Server(server, {
//   cors: {
//     origin: "*", 
//   }
// });

// app.set('io', io);

// app.use(cors());
// app.use(express.json({ limit: '10mb' }));
// app.use(express.urlencoded({ extended: false, limit: '10mb' }));

// io.on('connection', (socket) => {
//   console.log('User connected', socket.id);
//   socket.on('disconnect', () => {
//     console.log('User disconnected', socket.id);
//   });
// });

// app.use('/api/auth', require('./routes/authRoutes'));
// app.use('/api/users', require('./routes/userRoutes'));
// app.use('/api/posts', require('./routes/postRoutes'));

// const PORT = process.env.PORT || 5000;

// server.listen(PORT, () => console.log(`Server started on port ${PORT}`));

