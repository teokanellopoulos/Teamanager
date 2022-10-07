import { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import { Rankings } from '../Rankings.jsx';
import axios from 'axios';

export const Statistics = () => {
    const auth = useSelector(state => state.auth);
    const token = useSelector(state => state.token);
    const { koeCode, attendances, avgSprint } = auth.athlete;
    const [goals, setGoals] = useState(0);
    console.log(koeCode)

    useEffect(() => {
        const getGoals = async () => {
            if (koeCode) {
                try {
                    const res = await axios.get("/match/getGoalRankings", {
                        headers: { Authorization: token }
                    });
                    setGoals(res.data.find(a => a._id.koeCode === koeCode).totalGoals);
                } catch (error) {
                    window.location.href = "/statistics";
                }
            }
        }
        getGoals();
        // eslint-disable-next-line
    }, [koeCode]);

    return (
        <div>
            <p>Your total goals are {goals}</p>
            <p>Your total attendances are {attendances}</p>
            <p>Your average sprint is {avgSprint}s</p>
            <Rankings />
        </div>
    )
}
