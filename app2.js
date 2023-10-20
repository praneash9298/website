const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/Bike', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("Connected to MongoDB");
});

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    fullname: String
});

const User = mongoose.model('User', userSchema);
const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.post('/signup', function (req, res) {
    const { fullname, username, password } = req.body;
    const newUser = new User({
        fullname,
        username,
        password
    });

    newUser.save()
        .then(() => {
            console.log('User signed up successfully');
            return res.redirect('./login.html');
        })
        .catch(err => {
            console.error(err);
            return res.status(500).send('Error signing up. Please try again.');
        });
});
app.post('/login', function (req, res) {
    const { username, password } = req.body;
    User.findOne({ username, password })
        .then(user => {
            if (user) {
                console.log('User logged in successfully');
                return res.redirect('./pgr.html');
            } else {
                console.log('Invalid credentials. Redirecting to login page.');
                return res.redirect('./login.html');
            }
        })
        .catch(err => {
            console.error(err);
            return res.status(500).send('Error during login. Please try again.');
        });
});
app.listen(4000, function () {
    console.log("Server listening at port 4000");
});