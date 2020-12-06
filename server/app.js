/*
 * Galactic Diaries API root file.
 *
 * Galactic Diaries
 * Valencia College
 * Fall 2020
 */

// Modules
const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const morgan = require('morgan');
const fileupload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const sanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');
const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');

// Points to configuration values
dotenv.config({
    path: './config/development.env',
});

// Connect to DB
connectDB();

// Route Files
const users = require('./routes/users');
const posts = require('./routes/posts');
const auth = require('./routes/auth');

const port = process.env.PORT;

// Express app.
const app = express();

// Body Parser
app.use(express.json());

app.use(cookieParser());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// File upload
app.use(fileupload());

// Prevent NoSql injection
app.use(sanitize());

// Add security headers
app.use(helmet());

// Prevent Cross-site-scripting
app.use(xss());

// Rate limit
const limiter = rateLimit({ windowMs: 10 * 60 * 1000, max: 100 });
app.use(limiter);

// Prevent HTTP param pollution
app.use(hpp());

// Allow cross orgin resource sharing
app.use(cors());

// Mount Routers
app.use('/api/users', users);
app.use('/api/posts', posts);
app.use('/api/auth', auth);

// Set static folder
app.use(express.static(`${__dirname}/build`));

// Catchall for React
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, 'build/index.html'), function (err) {
        if (err) {
            res.status(500).send(err);
        }
    });
});

// Error handler Middleware
app.use(errorHandler);

// Launch Server.
const server = app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

// Handle unhandled promise errors
process.on('unhandledRejection', (err) => {
    console.log(`Error: ${err.message}`);
    // Close server and exit process
    server.close(() => process.exit(1));
});
