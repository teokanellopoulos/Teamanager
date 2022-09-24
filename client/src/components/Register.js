import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { errorMessage } from "./Notification";
import { useNavigate } from "react-router-dom";

export const Register = () => {

    const initialState = {
        fullName: "",
        yob: "",
        phone: "",
        email: "",
        password: "",
        err: ""
    };

    const navigate = useNavigate();

    const [athlete, setAthlete] = useState(initialState);
    const [display, setDisplay] = useState("block");

    const { fullName, yob, phone, email, password, err } = athlete;

    const handleInput = (e) => {
        const { name, value } = e.target;
        setAthlete({...athlete, [name]: value, err: "", success: ""});
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setDisplay("block");
        try {
            await axios.post("/athlete/register", {fullName, yob, phone, email, password});
            navigate("/");
        } catch (error) {
            setAthlete({...athlete, err: error.response.data.msg});
            setTimeout(() => {
                setDisplay("none");
            }, 3000);
        }
    }

    return (
        <div className="registerPage">
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    placeholder="Enter fullName" 
                    value={fullName}
                    name="fullName"
                    onChange={handleInput}
                    required
                /><br/>
                <input 
                    type="number" 
                    placeholder="Enter year of birth (1980 - 2030)" 
                    value={yob}
                    min="1980"
                    max="2030"
                    name="yob"
                    onChange={handleInput}
                    required
                /><br/>
                <input 
                    type="tel" 
                    placeholder="Enter phone" 
                    value={phone}
                    name="phone"
                    onChange={handleInput} 
                    required
                /><br/>
                <input 
                    type="text" 
                    placeholder="Enter email" 
                    value={email}
                    name="email"
                    onChange={handleInput}
                    required
                /><br/>
                <input 
                    type="password" 
                    placeholder="Enter password" 
                    value={password}
                    name="password"
                    onChange={handleInput} 
                    required
                /><br/>
                <button type="submit">Register</button>
            </form>
            <p>Already have an account? <Link to="/login">Login</Link></p>

            {err && errorMessage(err, display)}
        </div>
    )
}
