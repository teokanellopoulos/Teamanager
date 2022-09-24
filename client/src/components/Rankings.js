import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

export const Rankings = () => {
    const [ranking, setRanking] = useState([]);
    const [goalRanking, setGoalRanking] = useState([]);
    const token = useSelector(state => state.token);
    const [choice, setChoice] = useState("attendances");
    
    const handleChange = (event) => {
        const sortRank = [...ranking];
        
        if (event.target.value === "attendances") {
            sortRank.sort((a, b) => b.attendances - a.attendances);
        } else {
            sortRank.sort((a, b) => a.avgSprint - b.avgSprint);
        }
        setChoice(event.target.value);
        setRanking(sortRank);
    };

    useEffect(() => {
        const getAthletes = async () => {
            try {
                const res = await axios.get("/athlete/allAthletes", {
                    headers: { Authorization: token }
                });
                const goalRankings = await axios.get("/match/getGoalRankings", {
                    headers: { Authorization: token }
                });

                setRanking(res.data.sort((a, b) => b.attendances - a.attendances));
                setGoalRanking(goalRankings.data);
            } catch (error) {
                window.location.href = "/rankings";
            }
        }
        getAthletes();
        // eslint-disable-next-line
    }, []);

    return (
        <div>
            <label>
                Choose how you want to rank the athletes<br />
                <select onChange={handleChange}>
                    <option value="attendances">By Attendances</option>
                    <option value="goals">By Goals</option>
                    <option value="sprints">By Sprints</option>
                </select>
            </label>
            <div>
                {
                    choice === "goals" ? goalRanking.length !== 0 ?
                        goalRanking.map((athlete, i) => <p key={i}>{athlete._id.fullName} &nbsp;&nbsp; {choice}: &nbsp;&nbsp; {athlete.totalGoals}</p>)
                        : <p>Athletes haven't scored yet</p> :
                    choice === "attendances" ? ranking.length !== 0 ?
                        ranking.map((athlete, i) => <p key={i}>{athlete.fullName} &nbsp;&nbsp; {choice}: &nbsp;&nbsp; {athlete.attendances}</p>)  
                        : <p>No athletes</p> : ranking.length !== 0 ?
                                ranking.map((athlete, i) => <p key={i}>{athlete.fullName} &nbsp;&nbsp; {choice}: &nbsp;&nbsp; {athlete.avgSprint}</p>)
                        : <p>No athletes</p>
                }
            </div>
        </div>
    )
}
