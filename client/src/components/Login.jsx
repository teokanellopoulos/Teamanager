import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { dispatchLogIn } from "../redux/actions/actions.js";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import "../css/Login.css";
import { ErrorMessage } from "../components/Notification.jsx";

export const Login = () => {

    const initialState = {
        email: "",
        password: ""
    };

    const [athlete, setAthlete] = useState(initialState);
    const [display, setDisplay] = useState(true);
    const [err, setErr] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { email, password } = athlete;

    const handleInput = (e) => {
        const { name, value } = e.target;
        setAthlete({ ...athlete, [name]: value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErr("");
        setDisplay(true);
        try {
            const payload = { email, password };

            const response = await fetch("http://localhost:5000/athlete/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload),
                credentials: "include"
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.msg);
            }

            localStorage.setItem("firstLogin", true);
            dispatch(dispatchLogIn());
            navigate("/");
        } catch (error) {
            setErr(error.message);
            setDisplay(false);
        }
    }

    return (
        <div className="login-form-container">
            <ErrorMessage msg={err} className={display} />
            <div className="login-form">
                <h2 className="label">Login</h2>
                <form onSubmit={handleSubmit} className="log-fo">
                    <input
                        type="text"
                        placeholder="Enter email"
                        value={email}
                        name="email"
                        onChange={handleInput}
                        className="text-field"
                        required
                    /><br />
                    <input
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        name="password"
                        onChange={handleInput}
                        className="text-field"
                        required
                    /><br />
                    <button className="update">Login</button>
                </form>
                <p className="or">Or</p>
                <p className="new">New to the team? <Link className="register" to="/register">Register</Link></p>
            </div>
        </div>
    )
}
