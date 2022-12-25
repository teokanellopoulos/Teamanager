import { Carousel } from "../athleteComponents/Carousel.jsx";
import "../../css/athlete/Carousel.css";
import { useSelector } from "react-redux";
import { Statistics } from "./Statistics.jsx";
import { useState } from "react";
import "../../css/athlete/AthleteMainPage.css";

export const AthleteMainPage = () => {
    const auth = useSelector(state => state.auth);
    const { isLogged } = auth;
    const [isOpen, setIsOpen] = useState(false);
    const [buttonText, setButtonText] = useState("Show more");
    const [text, setText] = useState("Welcome to Teamanager. " +
        "Teamanager is an app made for the management" +
        " of the waterpolo team Athletic Union of Keratsini...");


    const handleClick = () => {
        setIsOpen(!isOpen);
        if (!isOpen) {
            setText("Welcome to Teamanager. Teamanager is " +
                "an app made for the management of the waterpolo team Athletic Union of " +
                "Keratsini. With this app every athlete has the ability to view his stats, " +
                "pay his monthly subscription and much more. To become a member of the team you can " +
                "register in this app and after that you can login to view your account. " +
                "For more information you can use the contact info down below or you can go " +
                "to the swimming pool of Keratsini in person to speak with the coach of the team.");
            setButtonText("Show less");
        } else {
            setText("Welcome to Teamanager. " +
                "Teamanager is an app made for the management " +
                "of the waterpolo team Athletic Union of Keratsini...");
            setButtonText("Show more");
        }
    }

    return (
        <div>
            {!isLogged ? <div>
                <Carousel />
                <div className="intro-container">
                    <p className="intro">
                        &emsp;{text}<br/>
                        <button onClick={handleClick} className="update">{buttonText}</button>
                    </p>
                </div>
            </div> : <div><Statistics /></div>}
        </div>

    )
}
