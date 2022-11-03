import { Link } from 'react-router-dom';
import { useSelector } from "react-redux";
import axios from 'axios';
import "../../css/athlete/AthleteNavBar.css";

export const AthleteNavBar = () => {
    const auth = useSelector(state => state.auth);

    const { athlete, isLogged } = auth;

    const handleLogout = async () => {
        try {
            await axios.get("/athlete/logout");
            localStorage.removeItem("firstLogin");
            window.location.href = "/";
        } catch (error) {
            window.location.href = "/";
        }
    }

    const showNav = () => {
        return (
            <li>
                <Link to="/participations">Participations</Link><br/>
                <Link to="/statistics">Statistics</Link><br/>
                <Link to="/events">Events</Link><br/>
                <Link to="/payments">Payments</Link><br/>
                <Link to="#">{athlete.fullName}</Link>
                <ul>
                    <li><Link to="/profile">Profile</Link></li>
                    <li><Link to="/" onClick={handleLogout}>Logout</Link></li>
                </ul>
            </li>
        )
    }
    return (
        <header className='athlete-nav'>
            <div className="logo">
                <h1><Link to="/">Teamanager</Link></h1>
            </div>
            <ul>
                <li><Link to="/">Main page</Link></li>
                {
                    isLogged ? showNav() : <li><Link to="/login">Login</Link></li>
                }
            </ul>
        </header>
    )
}
