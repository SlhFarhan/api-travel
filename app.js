require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve the 'uploads' folder publicly
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Import Routes
const authRoutes = require('./routes/auth.routes.js');
const travelRoutes = require('./routes/travel.routes.js'); // <-- Changed from filmRoutes

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/travels', travelRoutes); // <-- Changed from /api/films

// Base route
app.get('/', (req, res) => {
    res.send('Selamat Datang di Travel API! Server time: ' + new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }));
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});