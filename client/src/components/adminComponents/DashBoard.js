import { LineChart } from "./LineChart.js";
import { PaymentsProgressBar } from "./PaymentsProgressBar.js";
import VictoriesProgressBar from "./VictoriesProgressBar.js";
import { useEffect, useState } from "react";
import axios from "axios";
import "../../css/admin/DashBoard.css";
import { useSelector } from "react-redux";

export const DashBoard = () => {
    const [counter, setCounter] = useState("");
    const [results, setResults] = useState("");
    const token = useSelector(state => state.token);

    useEffect(() => {
        const getPercentage = async () => {
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
        getPercentage();
        // eslint-disable-next-line
    }, [counter]);

    return (
        <div>
            <LineChart/>
            <PaymentsProgressBar/>
            <VictoriesProgressBar/>
            <div>Total athletes: {counter}</div>
        </div>
    )
}
