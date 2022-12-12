import "../../css/athlete/Footer.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faPhone } from "@fortawesome/free-solid-svg-icons";

export const Footer = () => {
    return (
        <footer>
            <p className="contact">Contact us</p> 
            <div className="contact-info">
                <span className="info"><FontAwesomeIcon icon={faEnvelope} className="circle"/> teamanager@mail.com</span>
                <span className="info"><FontAwesomeIcon icon={faPhone} className="circle"/> 6969696420</span>
            </div>
            <hr></hr>
            <i>Copyright 2022 Teamanager</i>
        </footer>
    )
}
