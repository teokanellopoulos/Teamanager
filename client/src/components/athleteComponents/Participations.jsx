import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import { faIdCard, faBullseye, faUser } from "@fortawesome/free-solid-svg-icons";

export const Participations = () => {
    const [participations, setParticipations] = useState([]);
    const [matches, setMatches] = useState([]);
    const token = useSelector(state => state.token);
    const auth = useSelector(state => state.auth);
    const [checked, setChecked] = useState(false);
    const { athlete } = auth;
    const koeCode = athlete.koeCode;

    useEffect(() => {
        const getMatches = async () => {
            if (koeCode) {
                try {
                    const res = await axios.get("/match/getParticipations", {
                        params: {
                            koeCode
                        },
                        headers: { Authorization: token }
                    });
                    setParticipations(res.data);
                    const allMatches = await axios.get("/match/getMatches", {
                        headers: { Authorization: token }
                    });
                    setMatches(allMatches.data);
                } catch (error) {
                    window.location.href = "/participations";
                }
            }
        }
        getMatches();
        // eslint-disable-next-line
    }, [koeCode]);

    const handleCheck = () => {
        setChecked(!checked);
    }

    return (
        <div className="match-list">
            <label>
                Check the box to see all matches, uncheck to view participations
                <input
                    type="checkbox"
                    name="choice"
                    value="choice"
                    checked={checked}
                    onChange={handleCheck}
                /><br />
            </label>

            {
                checked ?
                    matches.length !== 0 ?
                        matches.map((match, i) => <motion.div
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
                                                        <FontAwesomeIcon icon={faUser} /> {participant.fullName}<br />
                                                        <FontAwesomeIcon icon={faIdCard} /> {participant.koeCode}<br />
                                                        <FontAwesomeIcon icon={faBullseye} /> {participant.goals}
                                                    </div>
                                                </div>
                                            )
                                        }
                                    </div>
                                </details>
                            </div>
                            <div style={{ height: "5px", width: "50px" }}>
                            </div>
                        </motion.div>) :
                        <p>No matches have been made</p>
                    : participations.length !== 0 ?
                        participations.map((match, i) =>  <motion.div
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
                                                    <FontAwesomeIcon icon={faUser} /> {participant.fullName}<br />
                                                    <FontAwesomeIcon icon={faIdCard} /> {participant.koeCode}<br />
                                                    <FontAwesomeIcon icon={faBullseye} /> {participant.goals}
                                                </div>
                                            </div>
                                        )
                                    }
                                </div>
                            </details>
                        </div>
                        <div style={{ height: "5px", width: "50px" }}>
                        </div>
                    </motion.div>) :
                        <p>You have no participations</p>
            }

        </div>
    )
}
