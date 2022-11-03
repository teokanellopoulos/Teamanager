import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../../css/admin/ViewMatches.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan, faPenToSquare, faIdCard, faBullseye, faUser } from "@fortawesome/free-solid-svg-icons";

export const ViewMatches = () => {

    const [matches, setMatches] = useState([]);
    const token = useSelector(state => state.token);
    const navigate = useNavigate();

    useEffect(() => {
        const getMatches = async () => {
            try {
                const res = await axios.get("/match/getMatches", {
                    headers: { Authorization: token }
                });
                setMatches(res.data);
            } catch (error) {
                window.location.href = "/viewMatches";
            }
        }
        getMatches();
        // eslint-disable-next-line
    }, []);

    const handleCreate = () => {
        navigate("/createMatch");
    }

    const handleUpdate = (match) => {
        navigate("/editMatch/" + match._id);
    }

    const handleDelete = async (data) => {
        try {
            await axios.delete("/match/deleteMatch", {
                data: { _id: data._id },
                headers: { Authorization: token }
            });

            setMatches(matches.filter(match => match._id !== data._id));
        } catch (error) {
            window.location.href = "/viewMatches";
        }
    }

    return (
        <div className="match-list">
            <button onClick={handleCreate} className="add-match">Create new match</button>
            {
                matches.length !== 0 ?
                    matches.map((match, i) =>
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, translateX: -50 }}
                            animate={{ opacity: 1, translateX: 0 }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            className={match.result}
                        >
                            <div className="count">{i + 1}.</div>
                            <div>
                                <h3>Keratsini VS {match.opponent}</h3>
                                <p>Date: {match.date.split("T")[0]}</p>
                                <p>Score: {match.teamGoals} - {match.opponentGoals}</p>
                                <p>Result: {match.result}</p>
                                <details>
                                    <summary>Participants</summary>
                                    <div className="participants-list">
                                        {
                                            match.participants.map((participant, j) =>
                                                <div className="participant-card" key={j}>
                                                    {j + 1}.
                                                    <div className="card-data">
                                                        <FontAwesomeIcon icon={faUser}/> {participant.fullName}<br />
                                                        <FontAwesomeIcon icon={faIdCard}/> {participant.koeCode}<br />
                                                        <FontAwesomeIcon icon={faBullseye}/> {participant.goals}
                                                    </div>
                                                </div>
                                            )
                                        }
                                    </div>
                                </details>
                            </div>
                            <div className="match-choice">
                                <FontAwesomeIcon icon={faPenToSquare} onClick={() => handleUpdate(match)} className="edit" />
                                <FontAwesomeIcon icon={faTrashCan} onClick={() => handleDelete(match)} className="trash" />
                            </div>
                        </motion.div>) :
                    <div className="no-data">No matches have been made</div>
            }
        </div>
    )
}
