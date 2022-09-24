import { NavLink } from 'react-router-dom';
import { useSelector } from "react-redux";
import axios from 'axios';
import "../../css/admin/AdminNavBar.css";
import { useState } from 'react';

export const AdminNavBar = () => {
    const auth = useSelector(state => state.auth);
    const [click, setClick] = useState(false);

    const handleClick = () => {
        setClick(!click);
    }

    const { isLogged } = auth;

    const handleLogout = async () => {
        try {
            await axios.get("/athlete/logout");
            localStorage.removeItem("firstLogin");
            window.location.href = "/";
        } catch (error) {
            window.location.href = "/";
        }
    }

    return (
        <nav className='admin-navbar'>
            <div className="nav-container">
                <NavLink to="/" className="nav-logo"><img src='/logo.png'></img></NavLink>
                <ul className={click ? "nav-menu active" : "nav-menu"}>
                    <li className="nav-item"><NavLink className='nav-links' onClick={handleClick} to="/">Dashboard</NavLink></li>
                    <li className="nav-item"><NavLink className='nav-links' onClick={handleClick} to="/rankings">Rankings</NavLink></li>
                    <li className="nav-item"><NavLink className='nav-links' onClick={handleClick} to="/updateAthletes">Update athletes</NavLink></li>
                    <li className="nav-item"><NavLink className='nav-links' onClick={handleClick} to="/viewPayments">View payments</NavLink></li>
                    <li className="nav-item"><NavLink className='nav-links' onClick={handleClick} to="/viewMatches">View matches</NavLink></li>
                    <li className="nav-item"><NavLink className='nav-links' onClick={handleClick} to="/viewAthletesInfo">View athletes info</NavLink></li>
                    <li className="nav-item"><NavLink className='nav-links' to="/logout" onClick={handleLogout}>Logout</NavLink></li>
                </ul>
                <div className="nav-icon" onClick={handleClick}>
                    <i className={click ? "fas fa-times" : "fas fa-bars"}></i>
                </div>
            </div>
        </nav>
    )
}
