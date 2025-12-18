const athletes = require("../models/athleteModel");

const authAdmin = async (req, res, next) => {
    try {
        const athlete = await athletes.findOne({_id: req.athlete.id});
        if(athlete.role !== 1)
            return res.status(400).json({msg: "Accessible by admin only"});
        next();
    } catch (error) {
        return res.status(500).json({msg: error.message});
    }
}

module.exports = authAdmin;
