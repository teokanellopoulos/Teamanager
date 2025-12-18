import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { EditAthlete } from "./EditAthlete.jsx";
import "../../css/admin/EditAthletes.css";

export const EditAthletes = () => {
    const [athletes, setAthletes] = useState([]);
    const [attendances, setAttendances] = useState([]);
    const token = useSelector(state => state.token);
    const date = new Date();

    useEffect(() => {
        const getAthletes = async () => {
            try {
                const res = await axios.get("/athlete/allAthletes", {
                    headers: { Authorization: token }
                });

                const att = await axios.get("/attendance/getMonthAttendances", {
                    params: {
                        month: date.getMonth() + 1,
                        year: date.getFullYear()
                    },
                    headers: { Authorization: token }
                });

                const results = res.data.sort((a, b) => a.fullName.localeCompare(b.fullName));
                setAthletes(results);
                setAttendances(att.data);
            } catch (error) {
                window.location.href = "/updateAthletes";
            }
        }
        getAthletes();
        // eslint-disable-next-line
    }, []);

    return (
        <div className="updateList">
            {athletes.length !== 0 && attendances.length !== 0 ? athletes.map((athlete, i) =>
                <EditAthlete
                    key={i}
                    count={i}
                    attendance={attendances.find((attendance) => attendance.koeCode === athlete.koeCode)}
                    athlete={athlete}
                />) :
                <div className="no-data">No available data</div>}
        </div>
    )
}
