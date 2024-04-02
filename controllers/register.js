 // controllers/auth.js
const User = require('../models/users.js');

function handleRegistration(req, res) {
    const { fname, lname, id, email, password } = req.body;

        // Create a new user document
        const newUser = new User({ fname, lname, id, email, password });

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
}

module.exports = { handleRegistration };
