import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import "../css/Rankings.css";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faBullseye, faUser, faIdCard, faMedal, faStopwatch, faCalendarCheck, faCaretDown, faCaretUp,
    faChartLine
} from "@fortawesome/free-solid-svg-icons";

export const Rankings = () => {
    const [sprintRanking, setSprintRanking] = useState([]);
    const [goalRanking, setGoalRanking] = useState([]);
    const [attendanceRanking, setAttendanceRanking] = useState([]);
    const token = useSelector(state => state.token);
    const [choice, setChoice] = useState("attendances");
    const auth = useSelector(state => state.auth);
    const { athlete } = auth;
    const [code, setCode] = useState();

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
                setCode(athlete.koeCode)
            } catch (error) {
                window.location.href = "/";
            }
        }
        getAthletes();
        // eslint-disable-next-line
    }, [athlete.koeCode]);

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
                            attendanceRanking.map((ath, i) =>
                                <motion.div
                                    key={i}
                                    className="card"
                                    initial={{ opacity: 0, translateX: -50 }}
                                    animate={{ opacity: 1, translateX: 0 }}
                                    transition={{ duration: 0.5, delay: i * 0.1 }}
                                    style={{ backgroundColor: ath._id.koeCode === code ? "#215268" : "#062433" }}
                                >
                                    {i + 1}. &nbsp;
                                    <div className="avatar">{ath._id.fullName.split(" ").map((word) => word.charAt(0).toUpperCase())}</div>
                                    <div className="content">
                                        <p className="name"><FontAwesomeIcon icon={faUser} />&nbsp;{ath._id.fullName}</p>
                                        <p><FontAwesomeIcon icon={faIdCard} />&nbsp;{ath._id.koeCode}</p>
                                        <p><FontAwesomeIcon icon={faCalendarCheck} />&nbsp;{ath.totalAttendances}</p>
                                    </div>
                                    <div className="icons">
                                        <FontAwesomeIcon className="medal" icon={faMedal} />
                                    </div>
                                </motion.div>)
                            : <div className="no-data">No athletes</div>
                        : choice === "goals" ?
                            goalRanking.length !== 0 ?
                                goalRanking.map((ath, i) =>
                                    <motion.div
                                        className="card"
                                        key={i}
                                        initial={{ opacity: 0, translateX: -50 }}
                                        animate={{ opacity: 1, translateX: 0 }}
                                        transition={{ duration: 0.5, delay: i * 0.1 }}
                                        style={{ backgroundColor: ath._id.koeCode === code ? "#215268" : "#062433" }}
                                    >
                                        {i + 1}. &nbsp;
                                        <div className="avatar">{ath._id.fullName.split(" ").map((word) => word.charAt(0).toUpperCase())}</div>
                                        <div className="content">
                                            <p className="name"><FontAwesomeIcon icon={faUser} />&nbsp;{ath._id.fullName}</p>
                                            <p><FontAwesomeIcon icon={faIdCard} />&nbsp;{ath._id.koeCode}</p>
                                            <p><FontAwesomeIcon icon={faBullseye} />&nbsp;{ath.totalGoals}</p>
                                        </div>
                                        <div className="icons">
                                            <FontAwesomeIcon className="medal" icon={faMedal} />
                                        </div>
                                    </motion.div>)
                                : <div className="no-data">Athletes haven't scored yet</div>
                            : sprintRanking.length !== 0 ?
                                sprintRanking.map((ath, i) =>
                                    <motion.div
                                        key={i}
                                        className="card"
                                        initial={{ opacity: 0, translateX: -50 }}
                                        animate={{ opacity: 1, translateX: 0 }}
                                        transition={{ duration: 0.5, delay: i * 0.1 }}
                                        style={{ backgroundColor: ath.koeCode === code ? "#215268" : "#062433" }}
                                    >
                                        {i + 1}. &nbsp;
                                        <div className="avatar">{ath.fullName.split(" ").map((word) => word.charAt(0).toUpperCase())}</div>
                                        <div className="content">
                                            <p className="name"><FontAwesomeIcon icon={faUser} />&nbsp;{ath.fullName}</p>
                                            <p><FontAwesomeIcon icon={faIdCard} />&nbsp;{ath.koeCode}</p>
                                            <p><FontAwesomeIcon icon={faChartLine} />&nbsp;{ath.avgSprint}</p>
                                            <p><FontAwesomeIcon icon={faStopwatch} />&nbsp;{ath.lastSprint}</p>
                                        </div>
                                        <div className="icons">
                                            <FontAwesomeIcon className="medal" icon={faMedal} />
                                            {
                                                parseFloat(ath.avgSprint) >= parseFloat(ath.lastSprint) ?
                                                    <FontAwesomeIcon icon={faCaretUp} style={{ color: "#06b814", height: "30px" }} /> :
                                                    <FontAwesomeIcon icon={faCaretDown} style={{ color: "red", height: "30px" }} />
                                            }
                                        </div>
                                    </motion.div>)
                                : <div className="no-data">No athletes</div>
                }
            </div>
        </div>
    )
}
