const express = require('express');
const authLogin = require('./login.js');
const authRegister = require ('./register.js');
const adminRouter = express.Router();
const Laboratory = require('../models/laboratories.js');
const User = require('../models/users.js');
const Reservations = require('../models/reservations.js');
const reserve = require('./reservation.js');
const reservations = require('../models/reservations.js');

adminRouter.get('/index', async (req, resp) => {
    try {
        const user = await User.findById(req.session.userId).lean(); 
        const labs = await Laboratory.find({}).lean();
        resp.render('main', { 
            layout:'admin', 
            title: 'Home',
            labs, user });
    } catch (err) {
        console.error(err);
        resp.status(500).send('Server Error');
    }
})

adminRouter.get('/ReservationAdminView', async (req, resp) => {
    const user = await User.findById(req.session.userId).lean();
    resp.render('ReservationAdminView', {
        layout: 'reservationadmin',
        title: 'Admin Reservation',
        user
    });
})





module.exports = adminRouter;