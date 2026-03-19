const express = require('express');

const app = express();

app.use(express.json());           // parse JSON bodies
app.use(express.static('./Front')) // Host Front

// Routes
const authRoutes = require('./routes');
app.use('/api', authRoutes);

// Start server
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});