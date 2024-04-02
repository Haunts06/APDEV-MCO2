const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: true
    },
    lname: {
        type: String,
        required: true
    },
    id: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    description1: {
        type: String,
        required: false,
        default: 'Hello, world!',
    },
    profilepic:{
        type: String,
        required: false,
        default: 'https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&q=70&fm=webp'
    },
    accountType:{
        type: String,
        enum: ['STUDENT', 'ADMIN'],
        required: true,
        default: 'STUDENT'
    }
});

module.exports = mongoose.model('User', UserSchema);
