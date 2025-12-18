const router = require("express").Router();
const auth = require("../middleware/auth.js");
const authAdmin = require("../middleware/authAdmin.js");
const paymentController = require("../controllers/paymentController.js");

router.get("/getPayments", auth, authAdmin, paymentController.getMonthlyPayments);
router.get("/paymentsByYear", auth, authAdmin, paymentController.paymentsByYear);
router.get("/getMonthPercentage", auth, authAdmin, paymentController.getMonthPercentage);
router.post("/payMonth", auth, paymentController.payMonth);
router.get("/getAthletePayments", auth, paymentController.getAthletePayments);
router.get("/getAllNonPayers", auth, authAdmin, paymentController.getAllNonPayers);

module.exports = router;
