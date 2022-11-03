const payments = require("../models/paymentModel.js");
const athletes = require("../models/athleteModel.js");
const stripe = require("stripe")(process.env.STRIPE_SECRET);
const nodemailer = require("nodemailer");
const date = new Date();

const paymentController = {
    getMonthlyPayments: async (req, res) => {
        try {
            const month = req.query.month;
            const year = req.query.year;

            if (!month || !year)
                return res.status(400).json({ msg: "Fill all required fields" });

            if (month < 1 || month > 12)
                return res.status(400).json({ msg: "Month must be between 1 - 12" });

            if (year < 2022)
                return res.status(400).json({ msg: "Year must be 2022 and up" });

            const results = await payments.find({
                $and: [
                    { month: month },
                    { year: year },
                    { attended: true}
                ]
            });

            res.status(200).json(results);
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },
    paymentsByYear: async (req, res) => {
        try {
            const results = await payments.aggregate([
                { $match: { paid: { $eq: true } } }, { $group: { _id: "$year", total: { $sum: 30 } } }
            ]);
            return res.status(200).json(results.sort((a, b) => a._id - b._id));
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },
    getMonthPercentage: async (req, res) => {
        try {
            const all = await payments.find({
                $and: [
                    { month: date.getMonth() + 1 },
                    { year: date.getFullYear() }
                ]
            }).count();

            const paid = await payments.find({
                $and: [
                    { month: date.getMonth() + 1 },
                    { year: date.getFullYear() },
                    { paid: { $eq: true } }
                ]
            }).count();


            if (all === 0)
                return res.status(200).json(0);

            const percentage = paid / all;
            res.status(200).json(percentage);
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },
    payMonth: async (req, res) => {
        try {
            const { id, koeCode, amount, month, year, email } = req.body;

            const payment = await stripe.paymentIntents.create({
                amount,
                currency: "USD",
                description: "Teamanager",
                payment_method: id,
                confirm: true
            });

            await payments.findOneAndUpdate({
                $and: [
                    { month: month },
                    { year: year },
                    { koeCode: koeCode }
                ]
            }, { paid: true });

            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: "teo6waterpolo@gmail.com",
                    pass: "bouihmqlnnhyphsy"
                }
            });

            const mailOptions = {
                from: "teo6waterpolo@gmail.com",
                to: email,
                subject: "Payment from Teamanager",
                html: "<h1>Payment for month " + month + " and year " + year + "</h1>" +
                    "<p>Thank you for your purchase</p>"
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });

            res.status(200).json(payment);
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },
    getAthletePayments: async (req, res) => {
        try {
            const koeCode = req.query.koeCode;
            const results = await payments.find({ koeCode: koeCode });
            res.status(200).json(results);
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },
    getAllNonPayers: async (req, res) => {
        try {
            const nonPayers = await payments.find({
            $and: [
                { attended: true },
                { paid: false }
            ]});

            res.status(200).json(nonPayers);
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    }
};

module.exports = paymentController;
