// Modules
const express = require('express');
const dotenv = require('dotenv');

// Route Files
const users = require('./routes/users');

// Points to configuration values
dotenv.config({
    path: './config/development.env',
});

// eslint-disable-next-line no-undef
const port = process.env.PORT;

// Express app.
const app = express();

// Mount Routers
app.use('/api/users', users);

// Launch Server.
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
