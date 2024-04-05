const express = require('express');
// const multer = require('multer');
const authLogin = require('./login.js');
const authRegister = require ('./register.js');
const router = express.Router();
const Laboratory = require('../models/laboratories.js');
const User = require('../models/users.js');
const Reservations = require('../models/reservations.js');
const reserve = require('./reservation.js');
const reservations = require('../models/reservations.js');
const labsController = require('./laboratory.js');
const helpDesk = require('../models/helpDesk.js');

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

router.get('/logout', function (req, resp) {
    req.session.destroy();
    resp.redirect('/LoginPage');
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

router.post('/submit-helpdesk', async (req, res) => {
    const user = await User.findById(req.session.userId).lean();
    const { userID, userEmail, title, description} = req.body;

    try {
        res.render('helpdesk', {
            layout: 'helpdesk',
            title: 'Helpdesk',
            user,
        });
        try {
            const sendConcern = await helpDesk.insertMany(
                { UserID: userID, email: userEmail, title: title, description: description}
                );

                console.log(sendConcern);
        } catch (error) {console.log(error);}
    } catch (error) {
        console.error(error);
        res.status(500).send('Error processing Helpdesk concern.')
    }
});

router.get('/home', async (req, res) => {
    try {
        const user = await User.findById(req.session.userId).lean(); 
        // const reservations = await Laboratory.find({}).lean();
        let reservations =  await Laboratory.aggregate([
            {
                $unwind: "$reservationData", // Deconstruct the reservationData array
            },
            {
                $unwind: "$reservationData.reservationList", // Deconstruct the reservationList array
            },
            {
                $match: {
                "reservationData.reservationList.UserID": user.id,
                },
            },
            {
                $project: {
                _id: 0, // Exclude the _id field
                labName: "$name",
                reservation: "$reservationData.reservationList" , // Include only the reservationList field
                },
            },
        ]);

        console.log(reservations);
        
        res.render('main', { 
            layout:'index', 
            title: 'Home',
            reservations, user });
    } catch (error) {
        errorFn(error);
    }
});

router.post('/home', async (req, res) => {
    try {
        const user = await User.findById(req.session.userId).lean(); 
        // const reservations = await Laboratory.find({}).lean();
        let reservations =  await Laboratory.aggregate([
            {
                $unwind: "$reservationData", // Deconstruct the reservationData array
            },
            {
                $unwind: "$reservationData.reservationList", // Deconstruct the reservationList array
            },
            {
                $match: {
                "reservationData.reservationList.UserID": user.id,
                },
            },
            {
                $project: {
                _id: 0, // Exclude the _id field
                reservation: "$reservationData.reservationList" , // Include only the reservationList field
                },
            },
        ]);

        res.render('main', { 
            layout:'index', 
            title: 'Home',
            reservations, user });
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
    let img = '';
    if (user.profilepic && user.profilepic.data) {
        img = `data:${user.profilepic.contentType};base64,${user.profilepic.data.toString('base64')}`;
    }
    resp.render('Profile',{
    layout: 'profile',
    title: 'Profile',
    user,
    img
    });
});

router.post('/updateProfile', async (req, resp) => {
    const user = await User.findById(req.session.userId).lean();
    const { fname, lname, id, email, description1 } = req.body;
    const userId = user._id;
    try {
        await User.findOneAndUpdate(
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

router.get('/AboutUs', async (req, resp) => {
    const user = await User.findById(req.session.userId).lean(); 
    resp.render('AboutUs', {
        layout: 'helpdesk',
        title: 'About Us',
        user
    });
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

    let labDetails = [];

    let reqReservationList = await Laboratory.aggregate([{ $match: { name: reqLabName, },},{ $unwind: "$reservationData", }, { $unwind: "$reservationData.reservationList", }, 
    { $match: { "reservationData.reservationList.date": selectedDate, "reservationData.reservationList.time": selectedTime }, }, 
    { $project: { _id: 0, reservation: "$reservationData.reservationList", }, }, ]);

    if(reqReservationList.length == 0) { // this if statement makes sure that what details is passed to the hbs is complete and not empty
        await labsController.checkExistingReservationList(reqReservationList, reqLabName, selectedDate, selectedTime);
        reqReservationList = await Laboratory.aggregate([{ $match: { name: reqLabName, },},{ $unwind: "$reservationData", }, { $unwind: "$reservationData.reservationList", }, 
                                                         { $match: { "reservationData.reservationList.date": selectedDate, "reservationData.reservationList.time": selectedTime }, }, 
                                                         { $project: { _id: 0, reservation: "$reservationData.reservationList", }, }, ] );
    }

    labDetails = await Laboratory.aggregate([
        { $match: { name: reqLabName } },
        { $unwind: "$reservationData" },
        { $unwind: "$reservationData.reservationList" },
        { $match: { "reservationData.reservationList.date": selectedDate, "reservationData.reservationList.time": selectedTime } },
        { $project: { _id: 0, "usage": "$reservationData.usage", "capacity": "$capacity", "status": "$reservationData.status" } },
        { $limit: 1 }
    ]);


    labDetails = await reserve.updateDetails(labDetails);

    console.log(labDetails); // remove soon

    
    const user = await User.findById(userId).lean();
    const reserveDates = await reserve.getNextFiveWeekdays();
    req.session.selectedLabName = reqLabName;  // set lab name to current session; global variable
    try {


        res.render('Reservation', {
            layout: 'reservation',
            title: 'Reservation',
            user, // pass the user's details to the template
            reserveDate: reserveDates,
            labName: reqLabName,
            labDetails,
            reqReservationList, // pass the selected lab's details to the template
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
    const reqLabName = req.session.selectedLabName;
    const selectedDate = req.session.date;
    const selectedTime = req.session.time;
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
        try {

            const updatedDocument = await Laboratory.findOneAndUpdate(
                { 
                    name: reqLabName,
                }, 
                { 
                    $set: {
                        "reservationData.$[].reservationList.$[inner].UserID": user.id,
                        "reservationData.$[].reservationList.$[inner].isOccupied": true,
                    },

                },
                { 
                    arrayFilters: [
                        { "inner.SlotID": SlotID, "inner.date": selectedDate, "inner.time": selectedTime, "inner.isOccupied": false },
                    ],
                    new: true, 
                }
            );
            await Laboratory.findOneAndUpdate( // increment usage
                {
                    name: reqLabName,
                },
                {
                    $inc: {
                        "reservationData.$[outer].usage": 1
                    }
                },
                { 
                    arrayFilters: [
                        { "outer.reservationList.date": selectedDate, "outer.reservationList.time": selectedTime },
                    ],
                    new: true, 
                }
            )
    
        } catch(error) {console.log(error);}


    } catch (error) {
        console.error(error);
        res.status(500).send('Error processing reservation.');
    }
});


router.post('/deleteReserve', async (req, res) => {
    const { labName, SlotID, date, time } = req.body;
    console.log("LabName: " + labName, "Date: " + date + " Time: " + time + " Slot ID: " + SlotID);

    try {
        await Laboratory.findOneAndUpdate(
            { 
                name: labName,
            },
            {
                $set: {
                    "reservationData.$[].reservationList.$[inner].UserID":  "", 
                    "reservationData.$[].reservationList.$[inner].isOccupied": false 
                },
            },
            {
                arrayFilters: [
                    { "inner.SlotID": SlotID, "inner.date": date, "inner.time": time },
                ],
                new: true
            }
        );
        await Laboratory.findOneAndUpdate(
            {
                name: labName,
            },
            {
                $inc: {
                    "reservationData.$[outer].usage": -1
                }
            },
            { 
                arrayFilters: [
                    { "outer.reservationList.date": date, "outer.reservationList.time": time },
                ],
                new: true, 
            }
        )
        

        console.log("Reservation deleted successfully");
        res.redirect("/home");
    } catch (error) {
        console.error("Error deleting reservation:", error);
        res.status(500).send("Error deleting reservation");
    }
});

router.post('/editReserve', async (req, res) => {
    const { labName, SlotID, date, time } = req.body;
    console.log("LabName: " + labName, "Date: " + date + " Time: " + time + " Slot ID: " + SlotID);
    try {
        await Laboratory.findOneAndUpdate(
            { 
                name: labName,
            },
            {
                $set: {
                    "reservationData.$[].reservationList.$[inner].UserID":  "", 
                    "reservationData.$[].reservationList.$[inner].isOccupied": false 
                },
                $inc: {
                    "reservationData.$[].usage": -1
                },
            },
            {
                arrayFilters: [
                    { "inner.SlotID": SlotID, "inner.date": date, "inner.time": time },
                ],
                new: true
            }
        );
        await Laboratory.findOneAndUpdate( // increment usage
                {
                    name: labName,
                },
                {
                    $inc: {
                        "reservationData.$[outer].usage": 1
                    }
                },
                { 
                    arrayFilters: [
                        { "outer.reservationList.date": date, "outer.reservationList.time": time },
                    ],
                    new: true, 
                }
            )

        console.log("Reservation deleted successfully");
        res.redirect("/reservation");
    } catch (error) {
        console.error("Error deleting reservation:", error);
        res.status(500).send("Error deleting reservation");
    }
});

module.exports = router;