import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { errorMessage } from "./Notification";
import { dispatchLogIn } from "../redux/actions/actions.js";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

export const Login = () => {

    const initialState = {
        email: "",
        password: "",
        err: ""
    };

    const [athlete, setAthlete] = useState(initialState);
    const [display, setDisplay] = useState("block");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const handleGoogle = async (response) => {
            setDisplay("block");
            try {
                await axios.post("/athlete/googleLogin", {tokenId: response.credential});
                localStorage.setItem("firstLogin", true);
                dispatch(dispatchLogIn());
                navigate("/");
            } catch (error) {
                setAthlete({ ...athlete, err: error.response.data.msg });
                setTimeout(() => {
                    setDisplay("none");
                }, 3000);
            }
        }

        /* global google */
        google.accounts.id.initialize({
            client_id: "439300862672-v4bi558o164ccjfgssqmqh1m9g23lnls.apps.googleusercontent.com",
            callback: handleGoogle
        });

        google.accounts.id.renderButton(
            document.getElementById("signInDiv"),
            { theme: "outline", size: "medium" }
        )
        // eslint-disable-next-line
    }, []);

    const { email, password, err } = athlete;

    const handleInput = (e) => {
        const { name, value } = e.target;
        setAthlete({ ...athlete, [name]: value, err: "" });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setDisplay("block");
        try {
            await axios.post("/athlete/login", { email, password });
            localStorage.setItem("firstLogin", true);
            dispatch(dispatchLogIn());
            navigate("/");
        } catch (error) {
            setAthlete({ ...athlete, err: error.response.data.msg });
            setTimeout(() => {
                setDisplay("none");
            }, 3000);
        }
    }

    return (
        <div className="loginPage">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Enter email"
                    value={email}
                    name="email"
                    onChange={handleInput}
                    required
                /><br />
                <input
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    name="password"
                    onChange={handleInput}
                    required
                /><br />
                <button type="submit">Login</button>
            </form>
            <p>Or</p>
            <div id="signInDiv"></div>
            <p>New to the team? <Link to="/register">Register</Link></p>

            {err && errorMessage(err, display)}
        </div>
    )
}
