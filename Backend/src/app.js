const express = require('express');
const path = require('path');
const cors = require('cors');
const convertRoutes = require('./routes/convertRoutes');

const app = express();

const corsOptions = {
  origin: [
    'https://telugudoc.netlify.app',
    'http://localhost:5173',
    'http://localhost:3000',
    process.env.FRONTEND_URL || 'http://localhost:5173'
  ],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve frontend and outputs
const publicDir = path.resolve('src/public');
app.use('/', express.static(publicDir));
app.use('/output', express.static(path.resolve(process.env.OUTPUT_DIR || 'output')));

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// API routes
app.use('/api', convertRoutes);

module.exports = app;
