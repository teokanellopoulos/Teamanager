require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

//Routes
app.use("/athlete", require("./routes/athleteRouter.js"));
app.use("/payment", require("./routes/paymentRouter.js"));
app.use("/match", require("./routes/matchRouter.js"));

mongoose.connect("mongodb://localhost:27017/Teamanager", (error) => {
    if(error)
        throw error;
    console.log("Connected to mongoDB");
});

app.get("/hello", (req, res) => {
    res.send("hello there");
});

app.listen(5000, () => {
    console.log("Server started on port 5000");
})
