const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const reservationsList = require('./reservations.js');

const laboratorySchema = new Schema({
    id: Number,
    name: String,
    status: {type: String, default: "Available"},
    usage: {type: Number, default: 0},
    capacity: Number,
    reservationData: [{ 
        UserID: {
        type: String,
        default: ""
    },
        SlotID: {
        type: Number, 
    },
    isOccupied:{type: Boolean, default: false},
    date: {type: String},  
    time: {type: String}}]
});

const Lab = mongoose.model('Lab', laboratorySchema);
module.exports = Lab;
