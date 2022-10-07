import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

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
        <div>
            {
                checked ?
                    matches.length !== 0 ?
                        matches.map((match, i) => <p key={i}>Keratsini VS {match.opponent}</p>) :
                    <p>No matches have been made</p>
                :   participations.length !== 0 ?
                        participations.map((match, i) => <p key={i}>Keratsini VS {match.opponent}</p>) :
                    <p>You have no participations</p>
            }
            Check the box to see all the matches
            <input
                type="checkbox"
                name="choice"
                value="choice"
                checked={checked}
                onChange={handleCheck}
            /><br />
        </div>
    )
}
