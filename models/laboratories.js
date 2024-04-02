const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reservationList = new Schema ({
    status: {type: String, default: "Available"}, 
    usage: {type: Number, default: 0},
    reservationList: [{ 
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
})

const laboratorySchema = new Schema({
    id: Number,
    name: String,
    capacity: Number,
    reservationData: [reservationList]
});

const Lab = mongoose.model('Lab', laboratorySchema);
module.exports = Lab;
