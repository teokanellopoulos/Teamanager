import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { errorMessage } from '../Notification.js';
import { useSelector } from 'react-redux';

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
    const [display, setDisplay] = useState("block");
    const { opponent, date, participants } = match;
    const navigate = useNavigate();

    useEffect(() => {
        const getAthletes = async () => {
            setDisplay("block");
            try {
                const res = await axios.get("/athlete/allAthletesInfo", {
                    headers: { Authorization: token }
                });
                setErr("");
                const results = res.data.sort((a, b) => a.fullName.localeCompare(b.fullName));
                setAthletes(results);
            } catch (error) {
                setErr(error.response.data.msg);
                setTimeout(() => {
                    setDisplay("none");
                }, 3000);
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
            aid: data._id,
            fullName: data.fullName,
            koeCode: data.koeCode,
            goals: 0
        };

        setMatch({ ...match, participants: [...participants, participant] })
    }
    const handleDelete = (data) => {
        setMatch({ ...match, participants: participants.filter(participant => participant.aid !== data._id) });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setDisplay("block");
        setErr("");
        try {
            await axios.post("/match/createMatch", { opponent, date, participants }, {
                headers: { Authorization: token }
            });
            navigate("/viewMatches");
        } catch (error) {
            setErr(error.response.data.msg);
            setTimeout(() => {
                setDisplay("none");
            }, 3000);
        }
    }

    return (
        <div>Enter the following data<br />
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Enter opponent team"
                    name="opponent"
                    value={opponent}
                    onChange={handleInput}
                    required
                /><br />
                Enter the date of the match<br />
                <input
                    type="date"
                    name="date"
                    value={date}
                    onChange={handleInput}
                    required
                /><br />
                <button>Create match</button>
            </form><br />
            <div>
                {athletes.map((athlete, i) => <p key={i}>{athlete.fullName}
                    {participants.find(participant => participant.aid === athlete._id) ?
                        <button onClick={() => handleDelete(athlete)}>Delete</button> :
                        <button onClick={() => handleAdd(athlete)}>Add</button>}</p>)}
            </div>
            {err && errorMessage(err, display)}

        </div>
    )
}
