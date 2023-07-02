import { useState, useEffect } from "react";
import axios from "axios";
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

    useEffect(() => {
        const handleGoogle = async (response) => {
            try {
                setErr("");
                setDisplay(true);
                await axios.post("/athlete/googleLogin", { tokenId: response.credential });
                localStorage.setItem("firstLogin", true);
                dispatch(dispatchLogIn());
                navigate("/");
            } catch (error) {
                setErr(error.response.data.msg);
                setDisplay(false);
            }
        }

        /* global google */
        google.accounts.id.initialize({
            client_id: "439300862672-v4bi558o164ccjfgssqmqh1m9g23lnls.apps.googleusercontent.com",
            callback: handleGoogle
        });

        google.accounts.id.renderButton(
            document.getElementById("signInDiv"),
            { theme: "outline", size: "medium", text: "signin_with", locale: "EN" }
        )
        // eslint-disable-next-line
    }, []);

    const { email, password } = athlete;

    const handleInput = (e) => {
        const { name, value } = e.target;
        setAthlete({ ...athlete, [name]: value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErr("");
        setDisplay(true);
        axios.post("/athlete/login", { email, password }).then(() => {
            localStorage.setItem("firstLogin", true);
            dispatch(dispatchLogIn());
            navigate("/");
        }).catch((error) => {
            setErr(error.response.data.msg);
            setDisplay(false);
        });
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
                <div id="signInDiv"></div>
                <p className="new">New to the team? <Link className="register" to="/register">Register</Link></p>
            </div>
        </div>
    )
}
