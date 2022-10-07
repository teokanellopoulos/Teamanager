const attendances = require("../models/attendanceModel.js");
const payments = require("../models/paymentModel.js");
const date = new Date();

const attendanceController = {
    getMonthAttendances: async (req, res) => {
        try {
            const month = req.query.month;
            const year = req.query.year;

            const attendancesList = await attendances.find({
                $and: [
                    { month: month },
                    { year: year }
                ]
            });

            res.status(200).json(attendancesList);
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },
    changeMonthAttendances: async (req, res) => {
        try {
            const { koeCode, month, year, numOfAttendances } = req.body.updatedAttendance;

            await attendances.findOneAndUpdate({
                $and: [
                    { month: month },
                    { year: year },
                    { koeCode: koeCode }
                ]
            }, { numOfAttendances: numOfAttendances });

            const monthAttendance = await attendances.findOne({
                $and: [
                    { month: month },
                    { year: year },
                    { koeCode: koeCode }
                ]
            });

            if (monthAttendance.numOfAttendances === 0) {
                await payments.findOneAndUpdate({
                    $and: [
                        { month: month },
                        { year: year },
                        { koeCode: koeCode }
                    ]
                }, { attended: false });
            } else {
                await payments.findOneAndUpdate({
                    $and: [
                        { month: month },
                        { year: year },
                        { koeCode: koeCode }
                    ]
                }, { attended: true });
            }

            res.status(200).json({ msg: "Attendances changed" });
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },
    getTotalAttendances: async (req, res) => {
        try {
            const totalAttendances = await attendances.aggregate([{
                $group: {
                    _id: { koeCode: "$koeCode", fullName: "$fullName" },
                    totalAttendances: { $sum: "$numOfAttendances" }
                }
            }]);

            res.status(200).json(totalAttendances);
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    }

};

module.exports = attendanceController;
