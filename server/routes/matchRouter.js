const router = require("express").Router();
const auth = require("../middleware/auth.js");
const authAdmin = require("../middleware/authAdmin.js");
const matchController = require("../controllers/matchController.js");

router.post("/createMatch", auth, authAdmin, matchController.createMatch);
router.get("/getMatches", auth, matchController.getMatches);
router.patch("/updateMatch", auth, authAdmin, matchController.updateMatch);
router.get("/getGoalRankings", auth, matchController.getGoalRankings);
router.delete("/deleteMatch", auth, authAdmin, matchController.deleteMatch);
router.get("/getVictoriesPercentage", auth, authAdmin, matchController.getVictoriesPercentage);
router.get("/getParticipations", auth, matchController.getParticipations);

module.exports = router;
