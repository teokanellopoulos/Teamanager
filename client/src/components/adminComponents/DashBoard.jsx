import { LineChart } from "./LineChart.jsx";
import { PaymentsProgressBar } from "./PaymentsProgressBar.jsx";
import VictoriesProgressBar from "./VictoriesProgressBar.jsx";
import { useEffect, useState } from "react";
import axios from "axios";
import "../../css/admin/DashBoard.css";
import { useSelector } from "react-redux";
import { ErrorMessage } from "../Notification.jsx";
import { Rankings } from "../Rankings.jsx";

export const DashBoard = () => {
    const [counter, setCounter] = useState("");
    const [results, setResults] = useState("");
    const [err, setErr] = useState("");
    const [display, setDisplay] = useState(true);
    const token = useSelector(state => state.token);

    useEffect(() => {
        const athleteCount = async () => {
            if (!results) {
                const res = await axios.get("/athlete/allAthletesCount", {
                    headers: { Authorization: token }
                });
                setResults(res.data);
                setCounter(0);
            }
            setTimeout(() => {
                if (counter < results) {
                    setCounter(counter + 1);
                }
            }, 100);
        }
        athleteCount();
        // eslint-disable-next-line
    }, [counter]);

    const handleClick = async () => {
        try {
            setErr("");
            setDisplay(true);
            await axios.post("/athlete/newYearPaymentsAndAttendances", {}, { headers: { Authorization: token } });
        } catch (error) {
            if (error.response.data.msg === "Invalid token") {
                window.location.href = `/`;
            } else {
                setErr(error.response.data.msg);
                setDisplay(false);
            }
        }
    }

    return (
        <div className="dashboard-container">
            <div className="error-container">
                <ErrorMessage msg={err} className={display} />
            </div>
            <div className="add-new-data">
                <button onClick={handleClick} className="new-data">Add new year payments and attendances</button>
            </div>
            <div className="stats-container">
                <div className="li-stats">
                    <LineChart />
                    <div className="stats">
                        <PaymentsProgressBar />
                        <VictoriesProgressBar />
                        <div className="total-athletes-container">Total athletes <div className="total-athletes">{counter}</div></div>
                    </div>
                </div>
                <Rankings />
            </div>
        </div>
    )
}
