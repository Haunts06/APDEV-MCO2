const User = require('../models/users.js');
const bcrypt = require('bcrypt');

const saltRounds = 10; // Define the number of salt rounds for hashing

async function handleRegistration(req, res) {
    const { fname, lname, id, email, password } = req.body;

    bcrypt.hash(password, saltRounds, function(err, hash) {
        if (err) {
            // Handle hashing error
            console.error(err);
            return res.redirect('/login?error=Error hashing password');
        }

        // Create a new user document with the hashed password
        const newUser = new User({ fname, lname, id, email, password: hash });

        // Save the user document to the database
        newUser.save()
            .then(() => {
                // If user is successfully saved, redirect to the main page or dashboard
                res.redirect('/');
            })
            .catch(err => {
                // If there's an error, redirect back to login page with error message
                res.redirect('/login?error=Error saving user');
            });
    });
}

module.exports = { handleRegistration };