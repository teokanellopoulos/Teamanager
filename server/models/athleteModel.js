const mongoose = require("mongoose");

const athleteSchema = new mongoose.Schema({
    role: {
        type: Number,
        default: 0
    },
    fullName: {
        type: String,
        required: true 
    },
    yob: {
        type: Number,
        required: true,
        min: 1980,
        max: 2030 
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    koeCode: {
        type: Number,
        required: true
    },
    attendances: {
        type: Number,
        default: 0
    },
    avgSprint: {
        type: Number,
        default: 0
    },
    lastSprint: {
        type: Number,
        default: 0
    },
    nofications: {
        type: Array,
        default: []
    }
});

module.exports = mongoose.model("athletes", athleteSchema);
