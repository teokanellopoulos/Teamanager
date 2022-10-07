import { useEffect, useState } from 'react';
import axios from "axios";
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { errorMessage } from '../Notification.jsx';
import { useNavigate } from 'react-router-dom';

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
    const [display, setDisplay] = useState("block");
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
                window.location.href = `/${param.id}`;
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

        try {
            setDisplay("block");
            setErr("");
            await axios.patch("/match/updateMatch", { _id, opponent, date, participants, opponentGoals, teamGoals }, {
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

    const handleAdd = (data) => {
        const participant = {
            aid: data._id,
            fullName: data.fullName,
            koeCode: data.koeCode,
            goals: 0
        };

        setMatch({ ...match, participants: [...participants, participant] });
    }

    const handleDelete = (data) => {
        setMatch({ ...match, participants: participants.filter(participant => participant.aid !== data._id) });
    }

    const handleChange = (e, data) => {
        const { name, value } = e.target;
        setMatch({
            ...match, participants: participants.map(participant => {
                if (participant.aid === data._id) {
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
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="opponent"
                    required
                    defaultValue={opponent}
                    onChange={handleInput}
                /><br />
                <input
                    type="date"
                    name="date"
                    required
                    defaultValue={date.split("T")[0]}
                    onChange={handleInput}
                /><br />
                <input
                    type="number"
                    min="0"
                    name="opponentGoals"
                    required
                    defaultValue={opponentGoals}
                    onChange={handleInput}
                /><br />
                <button>Update</button>
            </form><br />

            {err && errorMessage(err, display)}

            {athletes.map((athlete, i) => <div key={i}>{athlete.fullName}
                {participants.find(participant => participant.aid === athlete._id) ?
                    <div>Change goals
                        <input
                            type="number"
                            onChange={(e) => handleChange(e, athlete)}
                            name="goals"
                            defaultValue={participants.find(participant => participant.aid === athlete._id).goals}
                        />
                        <button onClick={() => handleDelete(athlete)}>Delete</button></div>
                    :
                    <button onClick={() => handleAdd(athlete)}>Add</button>}</div>)}
        </div>
    )
}
