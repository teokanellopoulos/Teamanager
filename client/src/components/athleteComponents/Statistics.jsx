import { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import { Rankings } from '../Rankings.jsx';
import axios from 'axios';
import "../../css/athlete/Statistics.css";

export const Statistics = () => {
    const auth = useSelector(state => state.auth);
    const token = useSelector(state => state.token);
    const { koeCode, avgSprint } = auth.athlete;
    const [goals, setGoals] = useState(0);
    const [participations, setParticipations] = useState(0);
    const [attendances, setAttendances] = useState(0);

    useEffect(() => {
        const getGoals = async () => {
            if (koeCode) {
                try {
                    const res = await axios.get("/match/getGoalRankings", {
                        headers: { Authorization: token }
                    });

                    const attendanceRankings = await axios.get("/attendance/getTotalAttendances", {
                        headers: { Authorization: token }
                    });

                    const getParticipations = await axios.get("/match/getParticipations", {
                        params: {
                            koeCode
                        },
                        headers: { Authorization: token }
                    });

                    setParticipations(getParticipations.data.length);

                    setGoals(res.data.find(a => a._id.koeCode === koeCode).totalGoals);

                    setAttendances(attendanceRankings.data.find(athlete => athlete._id.koeCode === koeCode).totalAttendances);
                } catch (error) {
                    window.location.href = "/";
                }
            }
        }
        getGoals();
        // eslint-disable-next-line
    }, [koeCode]);

    return (
        <div className="athlete-stats-container">
            <div className="athlete-stats">
                <p className="total-athletes-container astats">Total goals <div className="total-athletes">{goals}</div></p>
                <p className="total-athletes-container astats">Total attendances <div className="total-athletes">{attendances}</div></p>
                <p className="total-athletes-container astats">Average sprint <div className="total-athletes">{avgSprint}</div></p>
                <p className="total-athletes-container astats">Total participations <div className="total-athletes">{participations}</div></p>
            </div>
            <Rankings />
        </div>
    )
}
