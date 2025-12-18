import { useEffect, useState } from 'react';
import axios from "axios";
import { motion } from "framer-motion";
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ErrorMessage } from '../Notification.jsx';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faIdCard, faTrashCan, faUserPlus } from "@fortawesome/free-solid-svg-icons";

export const EditMatch = () => {
    const initialState = {
        opponent: "",
        date: "",
        participants: "",
        score: "",
        result: ""
    };

    const [match, setMatch] = useState(initialState);
    const param = useParams();
    const navigate = useNavigate();
    const [err, setErr] = useState("");
    const [display, setDisplay] = useState(true);
    const [athletes, setAthletes] = useState([]);
    const token = useSelector(state => state.token);
    const { _id, opponent, date, participants, opponentGoals } = match;

    useEffect(() => {
        const getData = async () => {
            try {
                const matches = await axios.get("/match/getMatches", {
                    headers: { Authorization: token }
                });

                const athletes = await axios.get("/athlete/allAthletes", {
                    headers: { Authorization: token }
                });
                setAthletes(athletes.data);
                setMatch(matches.data.find(match => match._id === param.id));
            } catch (error) {
                window.location.href = `/editMatch/${param.id}`;
            }
        }
        getData();
        // eslint-disable-next-line
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const teamGoals = participants.reduce((sum, participant) => {
            return sum + parseInt(participant.goals);
        }, 0);
        setDisplay(true);
        setErr("");

        try {
            await axios.patch("/match/updateMatch", { _id, opponent, date, participants, opponentGoals, teamGoals }, {
                headers: { Authorization: token }
            });
            navigate("/viewMatches");
        } catch (error) {
            if (error.response.data.msg === "Invalid token") {
                window.location.href = `/editMatch/${param.id}`;
            } else {
                setErr(error.response.data.msg);
                setDisplay(false);
            }
        }
    }

    const handleAdd = (data) => {
        const participant = {
            fullName: data.fullName,
            koeCode: data.koeCode,
            goals: 0
        };

        setMatch({ ...match, participants: [...participants, participant] });
    }

    const handleDelete = (data) => {
        setMatch({ ...match, participants: participants.filter(participant => participant.koeCode !== data.koeCode) });
    }

    const handleChange = (e, data) => {
        const { name, value } = e.target;
        setMatch({
            ...match, participants: participants.map(participant => {
                if (participant.koeCode === data.koeCode) {
                    return { ...participant, [name]: parseInt(value) }
                }
                return participant;
            })
        });
    }

    const handleInput = (e) => {
        const { name, value } = e.target;
        setMatch({ ...match, [name]: value });
    }

    return (
        <div className="match-container">
            <h3 className="header">Edit match</h3>
            <form onSubmit={handleSubmit} className="match-form">
                <p>Opponent name</p>
                <input
                    type="text"
                    name="opponent"
                    required
                    defaultValue={opponent}
                    onChange={handleInput}
                    className="text-field"
                /><br />
                Date of match: <br />
                <input
                    type="date"
                    name="date"
                    required
                    defaultValue={date.split("T")[0]}
                    onChange={handleInput}
                    className="text-field"
                /><br />
                Opponent goals: <br />
                <input
                    type="number"
                    min="0"
                    name="opponentGoals"
                    required
                    defaultValue={opponentGoals}
                    onChange={handleInput}
                    className="number-field"
                /><br />
                <button className="update">Update</button>
            </form><br />

            <ErrorMessage msg={err} className={display} />

            <h3 className="header">Change participants</h3>

            {athletes.map((athlete, i) =>
                <motion.div
                    initial={{ opacity: 0, translateX: -50 }}
                    animate={{ opacity: 1, translateX: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    key={i}
                    className="p-card"
                >
                    {participants.find(participant => participant.koeCode === athlete.koeCode) ?
                        <div className="p-card-container">
                            <p>{i + 1}.</p>
                            <div className="p-card-data">
                                <FontAwesomeIcon icon={faUser} /> {athlete.fullName}<br />
                                <FontAwesomeIcon icon={faIdCard} /> {athlete.koeCode}<br /><br />
                                Change goals<br />
                                <input
                                    type="number"
                                    className="number-field"
                                    onChange={(e) => handleChange(e, athlete)}
                                    name="goals"
                                    min="0"
                                    defaultValue={participants.find(participant => participant.koeCode === athlete.koeCode).goals}
                                />
                            </div>
                            <div>
                                <FontAwesomeIcon icon={faTrashCan} className="trash" onClick={() => handleDelete(athlete)} />
                            </div>
                        </div>
                        :
                        <div className="p-card-container">
                            <p>{i + 1}.</p>
                            <div className="p-card-data">
                                <FontAwesomeIcon icon={faUser} /> {athlete.fullName}<br />
                                <FontAwesomeIcon icon={faIdCard} /> {athlete.koeCode}<br />
                            </div>
                            <div>
                                <FontAwesomeIcon icon={faUserPlus} onClick={() => handleAdd(athlete)} className="add" />
                            </div>
                        </div>
                    }
                </motion.div>
            )}
        </div>
    )
}
