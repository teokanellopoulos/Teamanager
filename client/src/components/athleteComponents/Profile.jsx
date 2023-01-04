import { useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { ErrorMessage } from "../Notification.jsx";
import { dispatchAthlete, fetchAthlete } from "../../redux/actions/actions.js";
import { useNavigate } from "react-router-dom";

export const Profile = () => {

    const initialState = {
        fullName: "",
        yob: "",
        phone: ""
    };

    const auth = useSelector(state => state.auth);
    const token = useSelector(state => state.token);
    const dispatch = useDispatch();
    const { athlete } = auth;
    const [data, setData] = useState(initialState);
    const { fullName, yob, phone } = data;
    const [display, setDisplay] = useState(true);
    const [err, setErr] = useState("");
    const navigate = useNavigate();

    const handleInput = (e) => {
        const { name, value } = e.target;
        setData({ ...data, [name]: value, err: "" });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErr("");
        setDisplay(true);
        try {
            await axios.patch("/athlete/updateProfile", {
                fullName: fullName ? fullName : athlete.fullName,
                yob: yob ? yob : athlete.yob,
                phone: phone ? phone : athlete.phone,
                koeCode: athlete.koeCode
            }, {
                headers: { Authorization: token }
            });
            fetchAthlete(token).then(res => {
                dispatch(dispatchAthlete(res));
            });
            navigate("/");
        } catch (error) {
            if (error.response.data.msg === "Invalid token") {
                window.location.href = `/`;
            } else {
                setErr(error.response.data.msg);
                setDisplay(false);
            }
        }
    }

    return (
        <div className="login-form-container">
            <ErrorMessage msg={err} className={display} />
            <form onSubmit={handleSubmit} className="login-form">
                <h3 style={{ margin: "10px" }}>Change your data</h3>
                <input
                    type="text"
                    placeholder="Change fullName"
                    defaultValue={athlete.fullName}
                    name="fullName"
                    className="text-field"
                    onChange={handleInput}
                /><br />
                <input
                    type="tel"
                    placeholder="Change phone"
                    defaultValue={athlete.phone}
                    name="phone"
                    className="text-field"
                    onChange={handleInput}
                /><br />
                <input
                    type="number"
                    placeholder="Change year of birth"
                    defaultValue={athlete.yob}
                    name="yob"
                    className="text-field"
                    onChange={handleInput}
                /><br />
                <button type="submit" className="update">Change</button>
            </form>
        </div>
    )
}
