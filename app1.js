const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/FEEDBACK', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error"));
db.once('open', function () {
    console.log("MongoDB connection succeeded");
});

const feedbackSchema = new mongoose.Schema({
    name: String,
    num: String,
    email: String,
    feedback: String
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended: true
}));

app.post('/submit_feedback', function (req, res) {
    const name = req.body.name;
    const num = req.body.num;
    const email = req.body.email;
    const feedback = req.body.feedback;

    const data = new Feedback({
        name: name,
        num: num,
        email: email,
        feedback: feedback
    });

    data.save(function (err) {
        if (err) {
            console.error(err);
            res.status(500).send("Error submitting feedback");
        } else {
            console.log("Feedback submitted successfully");
            res.redirect('FeedbackSuccess.html'); // Create a success page for feedback submission
        }
    });
});

app.listen(3000);
console.log("Server listening at port 3000");
