import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ErrorMessage } from '../Notification.jsx';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faIdCard, faTrashCan, faUserPlus } from "@fortawesome/free-solid-svg-icons";

export const CreateMatch = () => {

    const initialState = {
        opponent: "",
        date: "",
        participants: []
    };

    const token = useSelector(state => state.token);
    const [err, setErr] = useState("");
    const [athletes, setAthletes] = useState([]);
    const [match, setMatch] = useState(initialState);
    const [display, setDisplay] = useState(true);
    const { opponent, date, participants } = match;
    const navigate = useNavigate();

    useEffect(() => {
        const getAthletes = async () => {
            try {
                const res = await axios.get("/athlete/allAthletesInfo", {
                    headers: { Authorization: token }
                });
                const results = res.data.sort((a, b) => a.fullName.localeCompare(b.fullName));
                setAthletes(results);
            } catch (error) {
                window.location.href = "/createMatch";
            }
        }
        getAthletes();
        // eslint-disable-next-line
    }, []);

    const handleInput = (e) => {
        const { name, value } = e.target;
        setMatch({ ...match, [name]: value });
    }

    const handleAdd = (data) => {
        const participant = {
            fullName: data.fullName,
            koeCode: data.koeCode,
            goals: 0
        };

        setMatch({ ...match, participants: [...participants, participant] })
    }

    const handleDelete = (data) => {
        setMatch({ ...match, participants: participants.filter(participant => participant.koeCode !== data.koeCode) });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setDisplay(true);
        setErr("");
        try {
            await axios.post("/match/createMatch", { opponent, date, participants }, {
                headers: { Authorization: token }
            });
            navigate("/viewMatches");
        } catch (error) {
            if (error.response.data.msg === "Invalid token") {
                window.location.href = "/createMatch";
            } else {
                setErr(error.response.data.msg);
                setDisplay(false);
            }
        }
    }

    return (
        <div className="match-container">
            <h3 className="header">Create match</h3>
            <form onSubmit={handleSubmit} className="match-form">
                <p>Opponent name</p>
                <input
                    type="text"
                    name="opponent"
                    value={opponent}
                    onChange={handleInput}
                    required
                    className="text-field"
                /><br />
                Enter the date of the match<br />
                <input
                    type="date"
                    name="date"
                    value={date}
                    className="text-field"
                    onChange={handleInput}
                    required
                /><br />
                <button className="create-match">Create match</button>
            </form><br />

            <ErrorMessage msg={err} className={display} />

            <h3 className="header">Add Participants</h3>
            {athletes.length === 0 ? <p>No athletes</p> :
                athletes.map((athlete, i) =>
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
                                    <FontAwesomeIcon icon={faIdCard} /> {athlete.koeCode}<br />
                                </div>
                                <div>
                                    <div>
                                        <FontAwesomeIcon icon={faTrashCan} className="trash" onClick={() => handleDelete(athlete)} />
                                    </div>
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
                    </motion.div>)
            }

        </div>
    )
}
