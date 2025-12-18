const router = require("express").Router();
const auth = require("../middleware/auth.js");
const authAdmin = require("../middleware/authAdmin.js");
const attendanceController = require("../controllers/attendanceController.js");

router.patch("/changeMonthAttendances", auth, authAdmin, attendanceController.changeMonthAttendances);
router.get("/getMonthAttendances", auth, authAdmin, attendanceController.getMonthAttendances);
router.get("/getTotalAttendances", auth, attendanceController.getTotalAttendances);

module.exports = router;
