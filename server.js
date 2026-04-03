const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

// ✅ ALLOWED ORIGINS
const allowedOrigins = [
  "http://localhost:5173",
  "https://social-media-app-pfgk.vercel.app",
  "https://social7.netlify.app"
];

// ✅ STRONG CORS FIX
app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (mobile apps, postman)
    if (!origin) return callback(null, true);

    // normalize origin (remove trailing slash)
    const normalizedOrigin = origin.replace(/\/$/, "");

    if (allowedOrigins.includes(normalizedOrigin)) {
      callback(null, true);
    } else {
      console.log("Blocked by CORS:", origin);
      callback(null, false); // IMPORTANT: don't throw error
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

const server = http.createServer(app);

// ✅ SOCKET.IO FIX (MATCH SAME LOGIC)
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"]
  }
});

app.get('/', (req, res) => {
  res.send('Server is running');
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

// ✅ ROUTES (KEEP SAME)
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/posts', require('./routes/postRoutes'));

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
