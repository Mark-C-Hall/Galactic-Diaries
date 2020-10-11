/*
 * Method for connecting to remote Mongo Database.
 *
 * Galactic Diaries
 * Valencia College
 * Fall 2020
 */

const mongoose = require('mongoose');

const connectDB = async () => {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
    });

    console.log(`MongoDb connected: ${conn.connection.host} `);
};

module.exports = connectDB;
