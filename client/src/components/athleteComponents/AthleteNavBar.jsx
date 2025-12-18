import { NavLink } from 'react-router-dom';
import { useSelector } from "react-redux";
import { useState } from "react";
import axios from 'axios';
import "../../css/athlete/AthleteNavBar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faBars } from "@fortawesome/free-solid-svg-icons";

export const AthleteNavBar = () => {
    const auth = useSelector(state => state.auth);

    const { athlete, isLogged } = auth;
    const [click, setClick] = useState(false);

    const handleClick = () => {
        setClick(!click);
    }

    const handleLogout = async () => {
        try {
            await fetch("http://localhost:5000/athlete/logout", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include"
            });
            localStorage.removeItem("firstLogin");
            window.location.href = "/";
        } catch (error) {
            window.location.href = "/";
        }
    }

    return (
        <nav className='athlete-nav'>
            <div className="nav-container">
                <NavLink to="/" className="nav-logo"><img src='/logo.png' alt=''></img></NavLink>
                <ul className={click ? "nav-menu active" : "nav-menu"}>{
                    isLogged ? <>
                        <li className="nav-item"><NavLink className="nav-links" onClick={handleClick} to="/participations">Participations</NavLink><br /></li>
                        <li className="nav-item"><NavLink className="nav-links" onClick={handleClick} to="/events">Events</NavLink><br /></li>
                        <li className="nav-item"><NavLink className="nav-links" onClick={handleClick} to="/payments">Payments</NavLink><br /></li>
                        <li className="nav-item"><NavLink className="nav-links" onClick={handleClick} style={{color: "yellow"}} to="/profile">{athlete.fullName} {athlete.koeCode}</NavLink></li>
                        <li className="nav-item"><NavLink className="nav-links" to="/" style={{color: "red"}} onClick={handleLogout}>Logout</NavLink></li>
                    </> :
                        <li className="nav-item"><NavLink className="nav-links" onClick={handleClick} to="/login">Login</NavLink></li>}
                </ul>
                <div className="nav-icon" onClick={handleClick}>
                    {click ? <FontAwesomeIcon icon={faXmark} /> : <FontAwesomeIcon icon={faBars} />}
                </div>
            </div>
        </nav>
    )
}
