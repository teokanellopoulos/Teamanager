import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { EditAthlete } from "./EditAthlete";

export const EditAthletes = () => {
    const [athletes, setAthletes] = useState([]);
    const token = useSelector(state => state.token);

    useEffect(() => {
        const getAthletes = async () => {
            try {
                const res = await axios.get("/athlete/allAthletes", {
                    headers: { Authorization: token }
                });

                const results = res.data.sort((a, b) => a.fullName.localeCompare(b.fullName));
                setAthletes(results);
            } catch (error) {
                setAthletes("An error has occured");
            }
        }
        getAthletes();
        // eslint-disable-next-line
    }, []);

    return (
        <div>
            {athletes.map((athlete, i) => <EditAthlete key={i} athlete={athlete} />)}
        </div>
    )
}
