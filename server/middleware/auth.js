const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
    try {
        const token = req.header("Authorization");
        if (!token)
            return res.status(400).json({ msg: "You have to login" });

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, athlete) => {
            if (err)
                return res.status(400).json({ msg: "Invalid token" });
            req.athlete = athlete;
            next();
        });

    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
}

module.exports = auth;
