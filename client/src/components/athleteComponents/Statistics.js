import { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import { Rankings } from '../Rankings.js';
import axios from 'axios';

export const Statistics = () => {
    const auth = useSelector(state => state.auth);
    const token = useSelector(state => state.token);
    const { athlete } = auth;
    const [goals, setGoals] = useState(0);
    const koeCode = athlete.koeCode;

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
    }, [auth.athlete.koeCode]);

    return (
        <div>
            <p>Your total goals are {goals}</p>
            <p>Your total attendances are {athlete.attendances}</p>
            <p>Your average sprint is {athlete.avgSprint}s</p>
            <Rankings />
        </div>
    )
}
