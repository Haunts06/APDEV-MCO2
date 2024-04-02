const express = require('express');
const authLogin = require('./login.js');
const authRegister = require ('./register.js');
const router = express.Router();
const Laboratory = require('../models/laboratories.js');
const User = require('../models/users.js');
const Reservations = require('../models/reservations.js');
const reserve = require('./reservation.js');
const reservations = require('../models/reservations.js');
const labsController = require('./laboratory.js');

function errorFn(error) {
    console.error(error);
    // error.status(500).send('Server Error');
}

router.get('/', function(req, resp){
    resp.render('LoginPage',{
        layout: 'login',
        title: 'Lab Reservation'
    });
});

router.post('/login', function (req,resp) {
    authLogin.handleLogin(req, resp);
});

router.post('/register', function (req,resp){
    authRegister.handleRegistration(req, resp);
});

router.get('/reservation', async (req,resp) =>{
    const user = await User.findById(req.session.userId).lean();
    const labs = await Laboratory.find({}).lean();
    const reserveDates = await reserve.getNextFiveWeekdays();

    resp.render('Reservation', {
        layout: 'reservation',
        title: 'Reservations',
        user,
        labs,
        reserveDate: reserveDates
    });
});

router.get('/helpdesk', async (req,resp) => {
    const user = await User.findById(req.session.userId).lean();
    resp.render('helpdesk',{
        layout: 'helpdesk',
        title: 'Helpdesk',
        user,
    });
});


router.get('/home', async (req, res) => {
    try {
        const user = await User.findById(req.session.userId).lean(); 
        const laboratories = await Laboratory.find({}).lean();
        res.render('main', { 
            layout:'index', 
            title: 'Home',
            laboratories, user });
    } catch (error) {
        errorFn(error);
    }
});

router.post('/home', async (req, res) => {
    try {
        const user = await User.findById(req.session.userId).lean(); 
        const laboratories = await Laboratory.find({}).lean();
        res.render('main', { 
            layout:'index', 
            title: 'Home',
            laboratories, user });
    } catch (error) {
        errorFn(error);
    }
});

router.get('/Profile', async (req,resp) =>{
    const user = await User.findById(req.session.userId).lean();
    resp.render('Profile',{
    layout: 'profile',
    title: 'Profile',
    user
    });
});

router.get('/EditProfile', async (req,resp) =>{
    const user = await User.findById(req.session.userId).lean();
   
    resp.render('EditProfile',{
        layout: 'editprofile',
        title: 'Edit Profile',
        user,
    });
});

router.post('/Profile', async (req,resp) =>{
    const user = await User.findById(req.session.userId).lean();
    resp.render('Profile',{
    layout: 'profile',
    title: 'Profile',
    user
    });
});

router.post('/updateProfile', async (req, resp) => {
    const user = await User.findById(req.session.userId).lean();
    const { fname, lname, id, email, description1 } = req.body;
    const userId = user._id;
    try {
        const updatedUser = await User.findOneAndUpdate(
            { _id: userId },
            { fname, lname, id, email, description1 },
            { new: true } 
        );
        resp.redirect(`/Profile`); // Redirect back to the profile page
    } catch (error) {
        errorFn(error);
    }
});

router.get('/LoginPage', function(req, resp){
    resp.redirect('/');
});

router.post('/selectlab', async (req, res) => {
    const userId = req.session.userId;
    const reqLabName = req.body.labName;
    const selectedDate = req.body.selectedDate;
    const selectedTime = req.body.time;

    req.session.date = selectedDate;
    req.session.time = selectedTime;

    console.log(req.body); // remove soon 
    console.log("LAB: ", reqLabName); // remove soon
    console.log("DATE: ", selectedDate); // remove soon
    console.log("TIME: ", selectedTime); // remove soon

    // const selectedLab = await Laboratory.find({name: reqLabName, reservationData: { $elemMatch: {reservationList: {$elemMatch: { date: req.session.date, time: req.session.time }}}}});
    // const selectedLab = await Laboratory.aggregate([
    //     { $match: { name: reqLabName, 
    //                 "reservationData.reservationList.date": req.session.date,
    //                 "reservationData.reservationList.time": req.session.time} }
    // ]);
    const selectedLab = await Laboratory.aggregate([
        { $match: { name: reqLabName, reservationData: { $elemMatch: { reservationList: { $elemMatch: { date: req.session.date, time: req.session.time } } } } } }
        ]);
       
    const user = await User.findById(userId).lean();
    const reserveDates = await reserve.getNextFiveWeekdays();
    req.session.selectedLabName = reqLabName;  // set lab name to current session; global variable
    try {

        labsController.checkExistingReservationList(selectedLab, reqLabName, selectedDate, selectedTime);

        // if(selectedLab === null ) {
        //     console.log(typeof selectedLab);
        //     console.log("null");
        // } else {        
        //     console.log(typeof selectedLab);
        //     console.log("list found!");
        //     // console.log(selectedLab.reservationData);
        //     selectedLab.forEach(lab => {
        //         lab.reservationData.forEach(data => {
        //            data.reservationList.forEach(reservation => {
        //              console.log(reservation); // This will log each object inside the reservationList array
        //            });
        //         });
        //     });

        // }

        res.render('Reservation', {
            layout: 'reservation',
            title: 'Reservation',
            user, // pass the user's details to the template
            reserveDate: reserveDates,
            selectedLab, // Pass the selected lab's details to the template
            // labUsage: (await reserve.availableCapacity(selectedLab)).toString(),
            labs: await Laboratory.find({}).lean(), // Pass the list of labs again for the dropdown
            date: selectedDate,
            time: selectedTime
        });
    } catch(error) { errorFn(error);}
});

router.post('/404', async (req, resp) => {
    const user = await User.findById(req.session.userId).lean();
    resp.render('404', {
        layout: 'editprofile',
        title: '404',
        user
    });
});

router.get('/404', async (req, resp) => {
    const user = await User.findById(req.session.userId).lean();
    resp.render('404', {
        layout: 'editprofile',
        title: '404',
        user
    });
});

router.post('/reserve', async (req, resp) => {
    const user = await User.findById(req.session.userId).lean();
    const SlotID = req.body.SlotID;
    console.log(req.body);
    resp.render('confirm-reservation', { 
        layout: 'reservation',
        SlotID, 
        user,
    });
});

router.post('/confirm-reservation', async (req, res) => {
    const SlotID = req.body.SlotID;
    const userId = req.session.userId;
    const labName = req.session.selectedLabName;
    const selectedLab = await Laboratory.findOne({name: labName, reservationData: { $elemMatch: { date: req.session.date, time: req.session.time }}});
    console.log("finding for (date): " + req.session.date);
    console.log("finding for (time): " + req.session.time);
    const user = await User.findById(userId).lean();
    const labs = await Laboratory.find({}).lean();
    const reserveDates = await reserve.getNextFiveWeekdays();
    
    try {
        res.render('Reservation', {
            layout: 'reservation',
            title: 'Reservations',
            user,
            labs,
            reserveDate: reserveDates
        });

        // if lab not found 
            // create a new reservations list but with a template of seats
            // just with a different date and time 

        console.log(labName);

        await Laboratory.findOneAndUpdate(
            { name: labName }, 
            { $set: { "reservationData.$[elem].UserID": user.id, "reservationData.$[elem].isOccupied": true, "reservationData.$[elem].date": req.session.date, "reservationData.$[elem].time": req.session.time } },
            { arrayFilters: [{ "elem.SlotID": SlotID, "elem.isOccupied": false }], new: true }
        );

    } catch (error) {
        console.error(error);
        res.status(500).send('Error processing reservation.');
    }
});

// router.post('/date', async (req, res) => {
//     tempDate = req.body.date;

//     const formattedDate = `${tempDate.getDate()}-${tempDate.getMonth() + 1}`

//     req.session.date = formattedDate;

//     console.log(req.session.date);
//     console.log(formattedDate);
//     res.redirect('/reservation');
// });

// router.post('/time', async (req, res) => {
//     req.session.time = req.body.time;
//     console.log(req.session.time);
//     res.redirect('/reservation');
// });
module.exports = router;