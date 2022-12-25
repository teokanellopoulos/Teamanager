import { useState } from "react";
import axios from "axios";
import { ErrorMessage } from "../components/Notification.jsx";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "../css/Register.css";

export const Register = () => {

    const initialState = {
        fullName: "",
        yob: "",
        phone: "",
        email: "",
        password: ""
    };

    const navigate = useNavigate();

    const [athlete, setAthlete] = useState(initialState);
    const [display, setDisplay] = useState(true);
    const [err, setErr] = useState("");

    const { fullName, yob, phone, email, password } = athlete;

    const handleInput = (e) => {
        const { name, value } = e.target;
        setAthlete({ ...athlete, [name]: value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErr("");
        setDisplay(true);
        try {
            await axios.post("/athlete/register", { fullName, yob, phone, email, password });
            navigate("/");
        } catch (error) {
            setErr(error.response.data.msg);
            setDisplay(false);
        }
    }

    return (
        <div className="register-form-container">
            <ErrorMessage msg={err} className={display} />
            <form onSubmit={handleSubmit} className="register-form">
                <h2 className="label">Register</h2>
                <input
                    type="text"
                    placeholder="Enter fullName"
                    value={fullName}
                    name="fullName"
                    onChange={handleInput}
                    required
                    className="text-field"
                /><br />
                <input
                    type="number"
                    placeholder="Enter year of birth"
                    value={yob}
                    name="yob"
                    onChange={handleInput}
                    required
                    className="text-field"
                /><br />
                <input
                    type="tel"
                    placeholder="Enter phone"
                    value={phone}
                    name="phone"
                    onChange={handleInput}
                    required
                    className="text-field"
                /><br />
                <input
                    type="text"
                    placeholder="Enter email"
                    value={email}
                    name="email"
                    onChange={handleInput}
                    required
                    className="text-field"
                /><br />
                <input
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    name="password"
                    onChange={handleInput}
                    required
                    className="text-field"
                /><br />
                <button className="update">Register</button>
                <p className="new">Already a member? <Link className="register" to="/login">Login</Link></p>
            </form>
        </div>
    )
}
