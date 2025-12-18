import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import "../css/NotFound.css";

export const NotFound = () => {
    return (
        <div className="warning-container">
            <FontAwesomeIcon icon={faTriangleExclamation} className="warning"/>
            <p>Page not found</p>
        </div>

    )
}
