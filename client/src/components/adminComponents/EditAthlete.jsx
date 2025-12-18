import { useState } from "react";
import axios from "axios";
import "../../css/admin/EditAthlete.css";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Button } from "./Button.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faIdCard } from "@fortawesome/free-solid-svg-icons";

export const EditAthlete = ({ athlete, attendance, count }) => {
    const token = useSelector(state => state.token);
    const date = new Date();
    const [updatedAthlete, setUpdatedAthlete] = useState(athlete);
    const [updatedAttendance, setUpdatedAttendance] = useState(attendance);

    const handleInput1 = (e) => {
        const { name, value } = e.target;
        setUpdatedAttendance({ ...updatedAttendance, [name]: value });
    }

    const handleInput2 = (e) => {
        const { name, value } = e.target;
        setUpdatedAthlete({ ...updatedAthlete, [name]: value });
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.patch("/athlete/updateAthlete", { updatedAthlete }, {
                headers: { Authorization: token }
            });

            await axios.patch("/attendance/changeMonthAttendances", { updatedAttendance }, {
                headers: { Authorization: token }
            });
        } catch (error) {
            window.location.href = "/updateAthletes"
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, translateX: -50 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ duration: 0.5, delay: count * 0.1 }}
            className="editCard"
        >
            <p className="count">{count + 1}.</p>
            <div className="userData">
                <p><FontAwesomeIcon icon={faUser} /> {athlete.fullName}</p>
                <p><FontAwesomeIcon icon={faIdCard} /> {attendance.koeCode}</p>
            </div>
            <form onSubmit={handleSubmit}>
                Attendances for {date.getMonth() + 1}/{date.getFullYear()}<br />
                <input
                    type="number"
                    min="0"
                    className="number-field"
                    defaultValue={attendance.numOfAttendances}
                    name="numOfAttendances"
                    onChange={handleInput1}
                    required
                /><br />
                Latest Sprint<br />
                <input
                    type="number"
                    min="0"
                    className="number-field"
                    step="any"
                    defaultValue={athlete.lastSprint}
                    name="lastSprint"
                    onChange={handleInput2}
                    required
                /><br />
                <Button />
            </form>
        </motion.div>
    )
}
