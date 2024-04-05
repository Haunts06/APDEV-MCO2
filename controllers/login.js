const User = require('../models/users.js');
const bcrypt = require('bcrypt');

async function handleLogin(req, res) {
    try {
        const user = await User.findOne({ id: req.body.loginId });
        password = req.body.loginPass;
        if (!user) {
            
            console.log('User not found');
            return res.redirect('/LoginPage');
        }

        let result = await bcrypt.compare(password, user.password);
        console.log(result);
            if (result) {
                if(user.accountType === "ADMIN") {
                    req.session.userId = user._id;
                    return res.redirect('/admin/index');
                }
                
                req.session.userId = user._id;
                return res.redirect('/home');
            } else {
                
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
