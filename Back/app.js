const express = require('express');
const cookieParser = require('cookie-parser');
const rateLimit = require("express-rate-limit");

const app = express();

app.disable('x-powered-by'); // As suggested by ZAP

// Rate limting
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
});

app.use(limiter);
app.use(express.json());           // parse JSON bodies
app.use(cookieParser());           // Allow Cookies

// Header Options
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; manifest-src 'self';"
  );
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  next();
});

app.use(express.static('./Front')) // Host Front

// Routes
const authRoutes = require('./routes');
app.use('/api', authRoutes);

// Start server
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});