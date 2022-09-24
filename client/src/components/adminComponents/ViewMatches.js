import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { errorMessage } from '../Notification.js';
import { useNavigate } from "react-router-dom";

export const ViewMatches = () => {

    const [matches, setMatches] = useState([]);
    const [err, setErr] = useState([])
    const token = useSelector(state => state.token);
    const [display, setDisplay] = useState("block");
    const navigate = useNavigate();

    useEffect(() => {
        const getMatches = async () => {
            try {
                setErr("");
                setDisplay("block");
                const res = await axios.get("/match/getMatches", {
                    headers: { Authorization: token }
                });
                setMatches(res.data);
            } catch (error) {
                setMatches(error.response.data.msg);
                setTimeout(() => {
                    setDisplay("none");
                }, 3000);
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
            setErr("");
            setDisplay("block");
            await axios.delete("/match/deleteMatch", {
                data: { _id: data._id },
                headers: { Authorization: token }
            });

            setMatches(matches.filter(match => match._id !== data._id));
        } catch (error) {
            setErr(error.response.data.msg);
            setTimeout(() => {
                setDisplay("none");
            }, 3000);
        }
    }

    return (
        <div>
            <div>
                {matches === "An error has occured" ? <p>{matches}</p> : matches.length === 0 ? <p>No matches have been made</p> :
                    matches.map((match, i) => <p key={i}>Keratsini VS {match.opponent}
                        <button onClick={() => handleUpdate(match)}>Update</button>
                        <button onClick={() => handleDelete(match)}>Delete</button>
                    </p>)}
            </div>
            {err && errorMessage(err, display)}
            <button onClick={handleCreate}>Create new match</button>
        </div>
    )
}
