import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

export const ViewAthletesInfo = () => {

    const [athletes, setAthletes] = useState([]);
    const token = useSelector(state => state.token);

    useEffect(() => {
        const getAthletes = async () => {
            try {
                const res = await axios.get("/athlete/allAthletesInfo", {
                    headers: { Authorization: token }
                });

                setAthletes(res.data);
            } catch (error) {
                window.location.href = "/viewAthletesInfo";
            }
        }
        getAthletes();
        // eslint-disable-next-line
    }, []);

    return (
        <div>
            {
                athletes.length !== 0 ? 
                athletes.map((athlete, i) => <p key={i}>{athlete.fullName} {athlete.phone} {athlete.email} {athlete.koeCode}</p>) :
                <p>No athletes</p>
            }
        </div>
    )
}
