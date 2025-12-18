const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema({
    opponent: {
        type: String,
        required: true
    },
    opponentGoals: {
        type: Number,
        default: 0
    },
    teamGoals: {
        type: Number,
        default: 0
    },
    result: {
        type: String,
        default: "draw"
    },
    date: {
        type: Date,
        required: true
    },
    participants: {
        type: [{
            koeCode: Number,
            fullName: String,
            goals: Number
        }]
    }
});

module.exports = mongoose.model("matches", matchSchema);