const User = require('../models/users.js');

async function handleLogin(req, res) {
    try {
        const user = await User.findOne({ id: req.body.loginId });
        if (user.accountType == 'ADMIN'){
            return res.redirect('/admin/index');
        }
        else{
        if (!user) {
            // If no user is found, redirect with error message
            console.log('User not found');
            return res.redirect('/LoginPage');
        } else {
            // Assuming you're not hashing passwords for simplicity, compare directly
            if (req.body.loginPass === user.password) {
                // If passwords match, redirect to the main page or dashboard
                console.log('Nice');
                req.session.userId = user._id;
                return res.redirect('/home');
            } else {
                // If passwords do not match, redirect back to login page with error message
                console.log('Wrong password');
                return res.redirect('/LoginPage');
            }
        }
    }
    } catch (err) {
        console.error(err);
        return res.redirect('/LoginPage');
    }
}

module.exports = { handleLogin };
