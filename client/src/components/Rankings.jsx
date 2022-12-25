import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import "../css/Rankings.css";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBullseye, faUser, faIdCard, faMedal, faStopwatch, faCalendarCheck } from "@fortawesome/free-solid-svg-icons";

export const Rankings = () => {
    const [sprintRanking, setSprintRanking] = useState([]);
    const [goalRanking, setGoalRanking] = useState([]);
    const [attendanceRanking, setAttendanceRanking] = useState([]);
    const token = useSelector(state => state.token);
    const [choice, setChoice] = useState("attendances");

    const handleChange = (event) => {
        setChoice(event.target.value);
    };

    useEffect(() => {
        const getAthletes = async () => {
            try {
                const res = await axios.get("/athlete/allAthletes", {
                    headers: { Authorization: token }
                });

                const goalRankings = await axios.get("/match/getGoalRankings", {
                    headers: { Authorization: token }
                });

                const attendanceRankings = await axios.get("/attendance/getTotalAttendances", {
                    headers: { Authorization: token }
                });

                setSprintRanking(res.data.sort((a, b) => a.avgSprint - b.avgSprint));
                setGoalRanking(goalRankings.data);
                setAttendanceRanking(attendanceRankings.data);
            } catch (error) {
                window.location.href = "/";
            }
        }
        getAthletes();
        // eslint-disable-next-line
    }, []);

    return (
        <div className="rank-container">
            <div className="selection">
                Athlete rankings<br />
                <select onChange={handleChange}>
                    <option value="attendances">By Attendances</option>
                    <option value="goals">By Goals</option>
                    <option value="sprints">By Sprints</option>
                </select>
            </div>
            <div className="list">
                {
                    choice === "attendances" ?
                        attendanceRanking.length !== 0 ?
                            attendanceRanking.map((athlete, i) =>
                                <motion.div
                                    key={i}
                                    className="card"
                                    initial={{ opacity: 0, translateX: -50 }}
                                    animate={{ opacity: 1, translateX: 0 }}
                                    transition={{ duration: 0.5, delay: i * 0.1 }}
                                >
                                    {i + 1}. &nbsp;
                                    <div className="avatar">{athlete._id.fullName.split(" ").map((word) => word.charAt(0).toUpperCase())}</div>
                                    <div className="content">
                                        <p className="name"><FontAwesomeIcon icon={faUser} />&nbsp;{athlete._id.fullName}</p>
                                        <p><FontAwesomeIcon icon={faIdCard} />&nbsp;{athlete._id.koeCode}</p>
                                        <p><FontAwesomeIcon icon={faCalendarCheck} />&nbsp;{athlete.totalAttendances}</p>
                                    </div>
                                    <FontAwesomeIcon className="medal" icon={faMedal} />
                                </motion.div>)
                        : <div className="no-data">No athletes</div>
                    : choice === "goals" ?
                        goalRanking.length !== 0 ?
                            goalRanking.map((athlete, i) =>
                                <motion.div
                                    className="card"
                                    key={i}
                                    initial={{ opacity: 0, translateX: -50 }}
                                    animate={{ opacity: 1, translateX: 0 }}
                                    transition={{ duration: 0.5, delay: i * 0.1 }}
                                >
                                    {i + 1}. &nbsp;
                                    <div className="avatar">{athlete._id.fullName.split(" ").map((word) => word.charAt(0).toUpperCase())}</div>
                                    <div className="content">
                                        <p className="name"><FontAwesomeIcon icon={faUser} />&nbsp;{athlete._id.fullName}</p>
                                        <p><FontAwesomeIcon icon={faIdCard} />&nbsp;{athlete._id.koeCode}</p>
                                        <p><FontAwesomeIcon icon={faBullseye} />&nbsp;{athlete.totalGoals}</p>
                                    </div>
                                    <FontAwesomeIcon className="medal" icon={faMedal} />
                                </motion.div>)
                        : <div className="no-data">Athletes haven't scored yet</div>
                    : sprintRanking.length !== 0 ? 
                        sprintRanking.map((athlete, i) =>
                            <motion.div
                                key={i}
                                className="card"
                                initial={{ opacity: 0, translateX: -50 }}
                                animate={{ opacity: 1, translateX: 0 }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                            >
                                {i + 1}. &nbsp;
                                <div className="avatar">{athlete.fullName.split(" ").map((word) => word.charAt(0).toUpperCase())}</div>
                                <div className="content">
                                    <p className="name"><FontAwesomeIcon icon={faUser} />&nbsp;{athlete.fullName}</p>
                                    <p><FontAwesomeIcon icon={faIdCard} />&nbsp;{athlete.koeCode}</p>
                                    <p><FontAwesomeIcon icon={faStopwatch} />&nbsp;{athlete.avgSprint}</p>
                                </div>
                                <FontAwesomeIcon className="medal" icon={faMedal} />
                            </motion.div>)
                    : <div className="no-data">No athletes</div>
                }
            </div>
        </div>
    )
}
