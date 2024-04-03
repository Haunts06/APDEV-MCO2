const User = require('../models/users.js');
const bcrypt = require('bcrypt');
const saltRounds = 10;

async function handleLogin(req, res) {
    try {
        const user = await User.findOne({ id: req.body.loginId });
        password = req.body.loginPass;
        if (!user) {
            // If no user is found, redirect with error message
            console.log('User not found');
            return res.redirect('/LoginPage');
        }
        // Compare hashed password using bcrypt.compare
        let result = await bcrypt.compare(password, user.password);
        console.log(result);
            if (result) {
                // If passwords match, redirect to the main page or dashboard
                console.log('Nice');
                req.session.userId = user._id;
                return res.redirect('/home');
            } else {
                // If passwords do not match, redirect back to login page with error message
                console.log(password);
                console.log(user.password);
                console.log('Wrong password');
                return res.redirect('/LoginPage');
            }
    } catch (err) {
        console.error(err);
        return res.redirect('/LoginPage');
    }
}

module.exports = { handleLogin };
