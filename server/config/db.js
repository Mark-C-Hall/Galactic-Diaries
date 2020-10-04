const mongoose = require('mongoose');

// Method for connecting to DB.
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
