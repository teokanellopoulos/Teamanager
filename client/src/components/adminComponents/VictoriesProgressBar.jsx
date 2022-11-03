import { useState, useEffect } from 'react';
import axios from 'axios';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { useSelector } from 'react-redux';
import 'react-circular-progressbar/dist/styles.css';

export default function VictoriesProgressBar() {
    const [counter, setCounter] = useState("");
    const [results, setResults] = useState("");
    const token = useSelector(state => state.token);

    useEffect(() => {
        const getPercentage = async () => {
            if (!results) {
                const res = await axios.get("/match/getVictoriesPercentage", {
                    headers: { Authorization: token }
                });
                setResults(res.data);
                setCounter(0);
            }
            setTimeout(() => {
                if (counter < results * 100) {
                    setCounter(counter + 1);
                }
            }, 10);
        }
        getPercentage();
        // eslint-disable-next-line
    }, [counter]);

    return (
        <div className="text">
            Victory percentage
            <div className="percentage">
                <CircularProgressbar value={counter} text={`${counter}%`} styles={buildStyles({ pathColor: "#558ca5" })} />
            </div>
        </div>
    )
}
