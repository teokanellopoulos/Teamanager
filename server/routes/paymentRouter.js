const router = require("express").Router();
const auth = require("../middleware/auth.js");
const authAdmin = require("../middleware/authAdmin.js");
const paymentController = require("../controllers/paymentController.js");

router.get("/getPayments", auth, authAdmin, paymentController.getMonthlyPayments);
router.post("/newYearPayments", auth, authAdmin, paymentController.newYearPayments);
router.get("/paymentsByYear", auth, authAdmin, paymentController.paymentsByYear);
router.get("/getMonthPercentage", auth, authAdmin, paymentController.getMonthPercentage);
router.post("/payMonth", auth, paymentController.payMonth);
router.get("/getAthletePayments", auth, paymentController.getAthletePayments);

module.exports = router;
