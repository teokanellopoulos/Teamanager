import "../css/Notification.css";

export const ErrorMessage = ({msg, className}) => {
    return (
        <div className={`error ${className ? "block" : "fade-out"}`}>{msg}</div>
    )
}

export const SuccessMessage = ({msg, className}) => {
    return (
        <div className={`error ${className ? "block" : "fade-out"}`}>{msg}</div>
    )
}

