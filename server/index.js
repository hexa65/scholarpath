const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const { createServer } = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: process.env.CLIENT_URL || '*' } });

// Attach io to app for use in controllers
app.set('io', io);

// ── Middleware ──────────────────────────────────────────
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || '*', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200, message: 'Too many requests' });
app.use('/api/', limiter);

// ── Routes ──────────────────────────────────────────────
app.use('/api/auth',         require('./routes/auth'));
app.use('/api/scholarships', require('./routes/scholarships'));
app.use('/api/applications', require('./routes/applications'));
app.use('/api/users',        require('./routes/users'));
app.use('/api/community',    require('./routes/community'));
app.use('/api/notifications',require('./routes/notifications'));
app.use('/api/uploads',      require('./routes/uploads'));
app.use('/api/analytics',    require('./routes/analytics'));
app.use('/api/admin',        require('./routes/admin'));

app.use('/api/contact',      require('./routes/contact'));
app.get('/api/health', (_, res) => res.json({ status: 'ok', ts: new Date() }));

// ── Error handler ───────────────────────────────────────
app.use(require('./middleware/errorHandler'));

// ── Socket.io ───────────────────────────────────────────
io.on('connection', socket => {
  console.log('Client connected:', socket.id);
  socket.on('join', userId => socket.join(`user:${userId}`));
  socket.on('disconnect', () => console.log('Client disconnected:', socket.id));
});

// ── Database + Start ────────────────────────────────────
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => { console.error('DB error:', err); process.exit(1); });
app.get('/api/seed-now', require('./utils/seed'));