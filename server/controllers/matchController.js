const matches = require("../models/matchModel.js");

const matchController = {
    createMatch: async (req, res) => {
        try {
            const { opponent, date, participants } = req.body;

            if (!opponent || !date)
                return res.status(400).json({ msg: "Please fill in all fields" });

            if (participants.length < 7 || participants.length > 15)
                return res.status(400).json({ msg: "You must put 7-15 participants in the match" });

            const match = await matches.findOne({ opponent, date });

            if (match)
                return res.status(400).json({ msg: "Match already exists" });

            const newMatch = new matches({
                opponent, date, participants
            });

            await newMatch.save();

            res.status(200).json({ msg: "Match created" });
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },
    getMatches: async (req, res) => {
        try {
            const allMatches = await matches.find();
            res.status(200).json(allMatches.sort((a, b) => new Date(a.date) - new Date(b.date)));
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },
    updateMatch: async (req, res) => {
        try {
            let { _id, opponent, date, participants, opponentGoals, teamGoals } = req.body;
            let result = "";

            if (!opponent || !date)
                return res.status(400).json({ msg: "Please fill in all fields" });

            if (participants.length < 7 || participants.length > 15)
                return res.status(400).json({ msg: "You must put 7-15 participants in the match" });

            const original = await matches.findOne({ _id });
            if (original.opponent !== opponent || new Date(original.date).getTime() !== new Date(date).getTime()) {
                const match = await matches.findOne({ opponent, date });
                if (match)
                    return res.status(400).json({ msg: "Match already exists" });
            }

            if (opponentGoals > teamGoals)
                result = "defeat";
            else if (opponentGoals < teamGoals)
                result = "victory";
            else
                result = "draw";

            await matches.findOneAndUpdate({ _id }, {
                opponent, teamGoals, opponentGoals, participants, date, result
            });

            res.status(200).json({ msg: "Match created" });
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },
    getGoalRankings: async (req, res) => {
        try {
            const rankings = await matches.aggregate([
                { $unwind: { path: "$participants" } },
                {
                    $group: {
                        _id: { koeCode: "$participants.koeCode", fullName: "$participants.fullName" },
                        totalGoals: { $sum: "$participants.goals" }
                    }
                }
            ]);
            res.status(200).json(rankings.sort((a, b) => b.totalGoals - a.totalGoals));
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },
    deleteMatch: async (req, res) => {
        try {
            const { _id } = req.body;
            await matches.findByIdAndDelete({ _id });
            res.status(200).json({msg: "Match deleted"});
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },
    getVictoriesPercentage: async (req, res) => {
        try {
            const all = await matches.find().count();
            
            const victories = await matches.find({result: "victory"}).count();

            if(all === 0)
                res.status(200).json(0);

            const percentage = victories / all;
            res.status(200).json(percentage);
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },
    getParticipations: async (req, res) => {
        try {
            const id = req.query.id;
            const participations = await matches.find({ participants: {$elemMatch: { aid: id }} });
            res.status(200).json(participations);
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    }
};

module.exports = matchController;
