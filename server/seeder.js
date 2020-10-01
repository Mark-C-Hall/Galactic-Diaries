const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Post = require('./models/Post');

// Load ENV variables
dotenv.config({ path: './config/development.env' });

// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
});

// Read JSON Files
const users = JSON.parse(
    fs.readFileSync(`${__dirname}/_data/users.json`, 'utf-8')
);
const posts = JSON.parse(
    fs.readFileSync(`${__dirname}/_data/posts.json`, 'utf-8')
);

// Import in DB
const importData = async () => {
    try {
        await User.create(users);
        await Post.create(posts);

        console.log('Data added to Db');
        process.exit();
    } catch (error) {
        console.error(error);
    }
};

// Delete Data
const deleteData = async () => {
    try {
        await User.deleteMany();
        await Post.deleteMany();

        console.log('Data Removed from Db.');
        process.exit();
    } catch (error) {
        console.error(error);
    }
};

// Run with options
if (process.argv[2] == '-i') {
    importData();
} else if ((process.argv[2] = '-d')) {
    deleteData();
}
