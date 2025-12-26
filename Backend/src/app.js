const express = require('express');
const path = require('path');
const cors = require('cors');
const convertRoutes = require('./routes/convertRoutes');

const app = express();

app.use(cors());
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
