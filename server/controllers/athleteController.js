const athletes = require("../models/athleteModel.js");
const payments = require("../models/paymentModel.js");
const matches = require("../models/matchModel.js");
const attendances = require("../models/attendanceModel.js");
const jwt = require("jsonwebtoken");
const date = new Date();

const athleteController = {
    register: async (req, res) => {
        try {
            const { fullName, yob, email, password, phone } = req.body;

            if(!fullName || !yob || !email || !password || !phone)
                return res.status(400).json({msg: "Please fill in all fields"});

            if(yob < 1980 || yob > 2030)
                return res.status(400).json({msg: "Year of birth must be between 1980 - 2030"});

            if(!validateEmail(email))
                return res.status(400).json({msg: "Invalid email"});
            
            if(password.length < 6)
                return res.status(400).json({msg: "Password must be at least 6 characters"});

            let koeCode = Math.floor(100000 + Math.random() * 900000);

            let koe = await athletes.findOne({koeCode});

            while(koe){
                koeCode = Math.floor(100000 + Math.random() * 900000);
                koe = await athletes.findOne({koeCode});
            }

            const ath = await athletes.findOne();
            
            if(!ath){
                const newAthlete = new athletes({
                    fullName, yob, email, password, phone, role: 1, koeCode
                });
    
                await newAthlete.save();
                return res.status(200).json({msg: "Registration complete"});
            }

            const athlete = await athletes.findOne({email});
            
            if(athlete)
                return res.status(400).json({msg: "Athlete already exists"});

            const newAthlete = new athletes({
                fullName, yob, email, password, phone, koeCode
            });

            await newAthlete.save();
            
            for(let i = date.getMonth() + 1 ; i <= 12; i++){
                let newPayment = new payments({
                    fullName, koeCode, month: i, year: date.getFullYear()
                });

                await newPayment.save();

                let newAttendance = new attendances({
                    fullName, koeCode, month: i, year: date.getFullYear()
                });

                await newAttendance.save();
            }
            
            res.status(200).json({msg: "Registration complete"});
        } catch (error) {
            return res.status(500).json({msg: error.message});
        }
    },
    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const athlete = await athletes.findOne({email});

            if(!athlete)
                return res.status(400).json({msg: "Athlete does not exist"});

            if(athlete.password.localeCompare(password) !== 0)
                return res.status(400).json({msg: "Incorrect password"});

            const refreshToken = createRefreshToken({id: athlete._id});
            
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                path: "/",
                maxAge: 7 * 24 * 60 * 60 * 1000
            });

            res.status(200).json({msg: "Login successful"});
        } catch (error) {
            console.log(error)
            return res.status(500).json({msg: error.message});
        }
    },
    getAccessToken: (req, res) => {
        try {
            const refreshToken = req.cookies.refreshToken;
            
            jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, athlete) => {
                if(err)
                    return res.status(400).json({msg: "Please login"});

                const accessToken = createAccessToken({ id: athlete.id });
                res.status(200).json({accessToken});
            });

        } catch (error) {
            console.log(error)
            return res.status(500).json({msg: error.message});
        }
    },
    getAthleteInfo: async (req, res) => {
        try {
            const athlete = await athletes.findById(req.athlete.id).select("-password");
            res.status(200).json(athlete);
        } catch (error) {
            return res.status(500).json({msg: error.message});
        }
    },
    getAllAthletes: async (req, res) => {
        try {
            const athletesList = await athletes.find({ role : { $ne : 1} }).select("-password -email -phone");
            res.status(200).json(athletesList);
        } catch (error) {
            console.log(error)
            return res.status(500).json({msg: error.message});
        }
    },
    getAllAthletesInfo: async (req, res) => {
        try {
            const athletesList = await athletes.find({ role : { $ne : 1} }).select("-password");
            res.status(200).json(athletesList.sort((a, b) => a.fullName.localeCompare(b.fullName)));
        } catch (error) {
            return res.status(500).json({msg: error.message});
        }
    },
    getAllAthletesCount: async (req, res) => {
        try {
            const total = await athletes.find({ role : { $ne : 1} }).count();
            res.status(200).json(total);
        } catch (error) {
            return res.status(500).json({msg: error.message});
        }
    },
    logout: async (req, res) => {
        try {
            res.clearCookie("refreshToken", {path: "/"});
            
            return res.status(200).json({msg: "Logged out"});
        } catch (error) {
            return res.status(500).json({msg: err.message});
        }
    },
    updateProfile: async (req, res) => {
        try {
            const { fullName, phone, yob, koeCode } = req.body;

            if(yob < 1980 || yob > 2030)
                return res.status(400).json({msg: "Year of birth must be between 1980 - 2030"});

            await athletes.findOneAndUpdate({_id: req.athlete.id}, {
                fullName, phone, yob
            });

            await payments.updateMany({koeCode: koeCode}, { fullName });
            await attendances.updateMany({koeCode: koeCode}, { fullName });
            await matches.updateMany({}, { $set: { "participants.$[participant].fullName": fullName}}, 
                { arrayFilters: [ { "participant.koeCode": koeCode } ] 
            });

            res.status(200).json({msg: "Athlete updated"});
        } catch (error) {
            return res.status(500).json({msg: error.message});
        }
    },
    updateAthlete: async (req, res) => {
        try {
            const { _id, lastSprint } = req.body.updatedAthlete;

            const athlete = await athletes.findOne({_id});

            if(!athlete)
                return res.status(400).json({msg: "Athlete not found"});

            let avgSprint = athlete.avgSprint;

            if(avgSprint !== 0){
                avgSprint = (parseFloat(avgSprint) + parseFloat(lastSprint)) / 2;
            }else
                avgSprint = lastSprint;
            
            if(lastSprint < 0)
                return res.status(400).json({msg: "Last sprint must be a positive number"});

            await athletes.findOneAndUpdate({_id: _id}, {
                avgSprint, lastSprint
            });

            res.status(200).json({msg: "Athlete updated"});
        } catch (error) {
            return res.status(500).json({msg: error.message});
        }
    },
    newYearPaymentsAndAttendances: async (req, res) => {
        try {
            let changed = 0;
            const allAthletes = await athletes.find({ role: { $ne: 1 } });
            for (let i = 0; i < allAthletes.length; i++) {
                let exists = await attendances.findOne({ koeCode: allAthletes[i].koeCode, year: date.getFullYear() });
                exists = exists && await payments.findOne({ koeCode: allAthletes[i].koeCode, year: date.getFullYear() });
                if (!exists) {
                    for (let j = 1; j <= 12; j++) {
                        let newMonthAttendance = new attendances({
                            fullName: allAthletes[i].fullName, month: j, year: date.getFullYear(), koeCode: allAthletes[i].koeCode
                        });
                        await newMonthAttendance.save();

                        let newMonthPayment = new payments({
                            fullName: allAthletes[i].fullName, month: j, year: date.getFullYear(), koeCode: allAthletes[i].koeCode
                        });
                        await newMonthPayment.save();
                    }
                } else
                    changed++;
            }

            if (changed === allAthletes.length)
                return res.status(400).json({ msg: "New year payments and attendances have already been added" });
            else
                return res.status(200).json({ msg: "New year payments and attendances have been added" });
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    }

};

const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
}

const createAccessToken = (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "15m"});
}

const createRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {expiresIn: "7d"});
}

module.exports = athleteController;
