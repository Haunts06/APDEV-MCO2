const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const helpdeskSchema = new Schema ({
    UserID: {type: String, default: ""},
    email: {type: String, default: ""},
    title: {type: String, default: ""},
    description: {type: String, default: ""}
})

const helpDesk = mongoose.model('helpDesk', helpdeskSchema);
module.exports = helpDesk;