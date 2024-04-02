const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const reservationSchema = new mongoose.Schema({
    UserID: {
        type: String,
        default: ""
    },
    LabName: {
        type: String,
        default: ""
    }, 
    SlotID: {
        type: Number, 
    },
    isOccupied:{type: Boolean, default: false},
    date: {type: Date},  
    time: {type: String}
});

const reservations = mongoose.model('reservations', reservationSchema);

module.exports = reservations;
