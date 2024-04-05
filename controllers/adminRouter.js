const express = require('express');
const authLogin = require('./login.js');
const authRegister = require ('./register.js');
const adminRouter = express.Router();
const Laboratory = require('../models/laboratories.js');
const User = require('../models/users.js');
const Reservations = require('../models/reservations.js');
const reserve = require('./reservation.js');
const reservations = require('../models/reservations.js');
const labsController = require('./laboratory.js');

adminRouter.get('/index', async (req, res) => {

    try {
        const user = await User.findById(req.session.userId).lean();
        let reservations =  await Laboratory.aggregate([
            {
                $unwind: "$reservationData", // Deconstruct the reservationData array
            },
            {
                $unwind: "$reservationData.reservationList", // Deconstruct the reservationList array
            },
            {
                $match: {
                "reservationData.reservationList.isOccupied": true,
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
        
        res.render('adminIndex', { 
            layout:'admin', 
            title: 'Admin Home',
            reservations,
            user
        });
    } catch (error) {
        console.log(error);
    }
});

adminRouter.post('/addreservation', async (req, res) => {
    const user = await User.findById(req.session.userId).lean();
    res.redirect('/admin/reservation');
});

adminRouter.post('/confirm-reservation', async (req, res) => {
    const SlotID = req.body.SlotID;
    const userId = req.session.userId;
    const reqLabName = req.session.selectedLabName;
    const selectedDate = req.session.date;
    const selectedTime = req.session.time;
    const user = await User.findById(userId).lean();
    const labs = await Laboratory.find({}).lean();
    const reserveDates = await reserve.getNextFiveWeekdays(); 
    let newUser = req.session.newUser;
   
    if(!newUser){
        newUser = "[hidden]";
    };
  
    try {
        res.render('ReservationAdmin', {
            layout: 'reservationadmin',
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
                        "reservationData.$[].reservationList.$[inner].UserID": newUser,
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

adminRouter.get('/reservation', async (req, resp) => {
    const user = await User.findById(req.session.userId).lean();
    const labs = await Laboratory.find({}).lean();
    const reserveDates = await reserve.getNextFiveWeekdays();
    resp.render('ReservationAdmin', {
        layout: 'reservationadmin',
        title: 'Admin Reservation',
        labs,
        user,
        reserveDate: reserveDates
    });
})

adminRouter.post('/reserve', async (req, resp) => {
    const user = await User.findById(req.session.userId).lean();
    const SlotID = req.body.SlotID;
    console.log(req.body);
    resp.render('confirm-reservation-admin', { 
        layout: 'reservationadmin',
        SlotID, 
        user,
    });
});



adminRouter.post('/deleteReserve', async (req, res) => {
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
        res.redirect("/admin/index");
    } catch (error) {
        console.error("Error deleting reservation:", error);
        res.status(500).send("Error deleting reservation");
    }
});

adminRouter.post('/editReserve', async (req, res) => {
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
        res.redirect("/admin/reservation");
    } catch (error) {
        console.error("Error deleting reservation:", error);
        res.status(500).send("Error deleting reservation");
    }
});

adminRouter.post('/selectlab', async (req, res) => {
    const userId = req.session.userId;
    const reqLabName = req.body.labName;
    const selectedDate = req.body.selectedDate;
    const selectedTime = req.body.time;
    const newUser = req.body.newID;
    req.session.newUser = newUser;
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


        res.render('ReservationAdmin', {
            layout: 'reservationadmin',
            title: 'Reservation',
            newUser: newUser,
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

adminRouter.get('/AboutUs', async (req, resp) => {
    const user = await User.findById(req.session.userId).lean(); 
    resp.render('AboutUs', {
        layout: 'helpdesk',
        title: 'About us',
        user
    });
});
module.exports = adminRouter;