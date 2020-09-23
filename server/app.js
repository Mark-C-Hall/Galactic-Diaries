// Modules
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
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

const port = process.env.PORT;

// Express app.
const app = express();

// Body Parser
app.use(express.json());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Mount Routers
app.use('/api/users', users);
app.use('/api/posts', posts);

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
