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
    aid: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    paid: {
        type: Boolean,
        default: 0
    }
});

module.exports = mongoose.model("payments", paymentSchema);