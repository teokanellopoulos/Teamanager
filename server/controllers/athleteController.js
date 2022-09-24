const athletes = require("../models/athleteModel.js");
const payments = require("../models/paymentModel.js");
const jwt = require("jsonwebtoken");
const date = new Date();
const { google } = require("googleapis");
const { OAuth2 } = google.auth;
const client = new OAuth2(process.env.CLIENT_ID);

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
                return res.status(400).json({msg: "Password must be atleast 6 characters"});

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
                res.status(200).json({msg: "Registration complete"});
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
                    fullName, koeCode, month: i, year: date.getFullYear(), aid: newAthlete._id,
                });

                await newPayment.save();
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
                path: "/athlete/refreshToken",
                maxAge: 7 * 24 * 60 * 60 * 1000
            });

            res.status(200).json({msg: "Login successful"});
        } catch (error) {
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
            res.clearCookie("refreshToken", {path: "/athlete/refreshToken"});
            
            return res.status(200).json({msg: "Logged out"});
        } catch (error) {
            return res.status(500).json({msg: err.message});
        }
    },
    updateProfile: async (req, res) => {
        try {
            const { fullName, phone, yob } = req.body;

            if(yob < 1980 || yob > 2030)
                return res.status(400).json({msg: "Year of birth must be between 1980 - 2030"});

            await athletes.findOneAndUpdate({_id: req.athlete.id}, {
                fullName, phone, yob
            });

            await payments.updateMany({aid: req.athlete.id}, { fullName });

            res.status(200).json({msg: "Athlete updated"});
        } catch (error) {
            return res.status(500).json({msg: error.message});
        }
    },
    deleteAthlete: async (req, res) => {
        try {
            await athletes.findByIdAndDelete({_id: req.params.id});

            res.status(200).json({msg: "Athlete deleted"});
        } catch (error) {
            return res.status(500).json({msg: error.message});
        }
    },
    googleLogin: async (req, res) => {
        try {
            const { tokenId } = req.body;
            const verify = await client.verifyIdToken({idToken: tokenId, requiredAudience: process.env.CLIENT_ID});
            
            const { email_verified, email } = verify.payload;

            if(email_verified){
                const athlete = await athletes.findOne({email});
                if(athlete){
                    const refreshToken = createRefreshToken({id: athlete._id});
            
                    res.cookie("refreshToken", refreshToken, {
                        httpOnly: true,
                        path: "/athlete/refreshToken",
                        maxAge: 7 * 24 * 60 * 60 * 1000
                    });
                    return res.status(200).json({msg: "Login complete"});
                }else 
                    return res.status(400).json({msg: "Your email is not linked to a google account"});
            }else
                return res.status(400).json({msg: "Google login failed"});
            
        } catch (error) {
            return res.status(500).json({msg: error.message});
        }
    },
    updateAthlete: async (req, res) => {
        try {
            const { _id, attendances, lastSprint } = req.body.updatedAthlete;

            const athlete = await athletes.findOne({_id});

            let avgSprint = athlete.avgSprint;

            if(avgSprint !== 0){
                avgSprint = (parseFloat(avgSprint) + parseFloat(lastSprint)) / 2;
            }else
                avgSprint = lastSprint;
            
            if(attendances < 0)
                return res.status(400).json({msg: "Attendances must be a positive number"});
            
            if(lastSprint < 0)
                return res.status(400).json({msg: "Last sprint must be a positive number"});

            await athletes.findOneAndUpdate({_id: _id}, {
                attendances, avgSprint, lastSprint
            });

            res.status(200).json({msg: "Athlete updated"});
        } catch (error) {
            return res.status(500).json({msg: error.message});
        }
    }
};

const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
};

const createAccessToken = (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "15m"});
}

const createRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {expiresIn: "7d"});
}

module.exports = athleteController;
