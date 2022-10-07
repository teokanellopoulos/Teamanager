const router = require("express").Router();
const athleteController = require("../controllers/athleteController.js");
const auth = require("../middleware/auth.js");
const authAdmin = require("../middleware/authAdmin.js");

router.post("/register", athleteController.register);
router.post("/login", athleteController.login);
router.post("/refreshToken", athleteController.getAccessToken);
router.get("/athleteInfo", auth, athleteController.getAthleteInfo);
router.get("/allAthletes", auth, athleteController.getAllAthletes);
router.get("/allAthletesInfo", auth, authAdmin, athleteController.getAllAthletesInfo);
router.get("/allAthletesCount", auth, authAdmin, athleteController.getAllAthletesCount);
router.patch("/updateProfile", auth, athleteController.updateProfile);
router.patch("/updateAthlete", auth, authAdmin, athleteController.updateAthlete);
router.get("/logout", athleteController.logout);
router.post("/googleLogin", athleteController.googleLogin);

module.exports = router;
