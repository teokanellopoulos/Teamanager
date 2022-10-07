const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true 
    },
    month: {
        type: Number,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    koeCode: {
        type: Number,
        required: true
    },
    numOfAttendances: {
        type: Number,
        default: 0
    } 
});

module.exports = mongoose.model("attendances", attendanceSchema);
