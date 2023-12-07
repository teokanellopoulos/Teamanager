require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();
app.use(express.json());
const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,  // Enable credentials (cookies)
  };
app.use(cors(corsOptions));
app.use(cookieParser());

//Routes
app.use("/athlete", require("./routes/athleteRouter.js"));
app.use("/payment", require("./routes/paymentRouter.js"));
app.use("/match", require("./routes/matchRouter.js"));
app.use("/attendance", require("./routes/attendanceRouter.js"));

mongoose.connect("mongodb://0.0.0.0:27017/Teamanager", (error) => {
    if(error)
        throw error;
    console.log("Connected to mongoDB");
});

app.listen(5000, () => {
    console.log("Server started on port 5000");
})
