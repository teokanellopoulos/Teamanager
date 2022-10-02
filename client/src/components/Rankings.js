import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import "../css/Rankings.css";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBullseye, faUser, faIdCard, faMedal } from "@fortawesome/free-solid-svg-icons";

export const Rankings = () => {
    const [ranking, setRanking] = useState([]);
    const [goalRanking, setGoalRanking] = useState([]);
    const token = useSelector(state => state.token);
    const [choice, setChoice] = useState("attendances");

    const handleChange = (event) => {
        const sortRank = [...ranking];

        if (event.target.value === "attendances") {
            sortRank.sort((a, b) => b.attendances - a.attendances);
        } else {
            sortRank.sort((a, b) => a.avgSprint - b.avgSprint);
        }
        setChoice(event.target.value);
        setRanking(sortRank);
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

                setRanking(res.data.sort((a, b) => b.attendances - a.attendances));
                setGoalRanking(goalRankings.data);
            } catch (error) {
                window.location.href = "/rankings";
            }
        }
        getAthletes();
        // eslint-disable-next-line
    }, []);

    return (
        <div className="rank-container">
            <label>
                Choose how you want to rank the athletes<br />
                <select onChange={handleChange}>
                    <option value="attendances">By Attendances</option>
                    <option value="goals">By Goals</option>
                    <option value="sprints">By Sprints</option>
                </select>
            </label>
            <div className="list">
                {
                    choice === "goals" ? goalRanking.length !== 0 ?
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
                                    <p><FontAwesomeIcon icon={faIdCard} /> &nbsp;{athlete._id.koeCode}</p>
                                    <p><FontAwesomeIcon icon={faBullseye} /> &nbsp;{athlete.totalGoals}</p>
                                </div>
                                <FontAwesomeIcon className="medal" icon={faMedal} />
                            </motion.div>)

                        : <p>Athletes haven't scored yet</p> :
                        choice === "attendances" ? ranking.length !== 0 ?
                            ranking.map((athlete, i) =>
                                <div key={i}>{athlete.fullName} &nbsp;&nbsp; {choice}: &nbsp; {athlete.attendances}</div>)
                            : <div>No athletes</div> : ranking.length !== 0 ?
                            ranking.map((athlete, i) => <div key={i}>{athlete.fullName} &nbsp;&nbsp; {choice}: &nbsp; {athlete.avgSprint}</div>)
                            : <p>No athletes</p>
                }
            </div>
        </div>
    )
}
