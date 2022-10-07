const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
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
    attended: {
        type: Boolean,
        default: false
    },
    paid: {
        type: Boolean,
        default: 0
    }
});

module.exports = mongoose.model("payments", paymentSchema);