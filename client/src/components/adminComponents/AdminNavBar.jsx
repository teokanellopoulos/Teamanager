import { NavLink } from 'react-router-dom';
import axios from 'axios';
import "../../css/admin/AdminNavBar.css";
import { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faBars } from "@fortawesome/free-solid-svg-icons";

export const AdminNavBar = () => {
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
        <nav className='admin-navbar'>
            <div className="nav-container">
                <NavLink to="/" className="nav-logo"><img src='/logo.png' alt=''></img></NavLink>
                <ul className={click ? "nav-menu active" : "nav-menu"}>
                    <li className="nav-item"><NavLink className='nav-links' onClick={handleClick} to="/updateAthletes">Update athletes</NavLink></li>
                    <li className="nav-item"><NavLink className='nav-links' onClick={handleClick} to="/viewPayments">View payments</NavLink></li>
                    <li className="nav-item"><NavLink className='nav-links' onClick={handleClick} to="/viewMatches">View matches</NavLink></li>
                    <li className="nav-item"><NavLink className='nav-links' onClick={handleClick} to="/viewAthletesInfo">View athletes info</NavLink></li>
                    <li className="nav-item"><NavLink className='nav-links' onClick={handleLogout} style={{color: "red"}} to="/">Logout</NavLink></li>
                </ul>
                <div className="nav-icon" onClick={handleClick}>
                    {click ? <FontAwesomeIcon icon={ faXmark } /> : <FontAwesomeIcon icon={ faBars } />}
                </div>
            </div>
        </nav>
    )
}
