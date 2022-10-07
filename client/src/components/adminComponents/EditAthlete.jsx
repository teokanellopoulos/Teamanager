import { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

export const EditAthlete = ({ athlete, attendance }) => {
    const token = useSelector(state => state.token);
    const [updatedAthlete, setUpdatedAthlete] = useState(athlete);
    const [updatedAttendance, setUpdatedAttendance] = useState(attendance);

    const handleInput1 = (e) => {
        const { name, value } = e.target;  
        setUpdatedAttendance({...updatedAttendance, [name]: value});
    }

    const handleInput2 = (e) => {
        const { name, value } = e.target;  
        setUpdatedAthlete({...updatedAthlete, [name]: value});
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.patch("/athlete/updateAthlete", {updatedAthlete}, {
                headers: { Authorization: token }
            });

            await axios.patch("/attendance/changeMonthAttendances", {updatedAttendance}, {
                headers: { Authorization: token }
            });
        } catch (error) {
            console.log(error.response.data.msg)
        }
    }

    return (
        <div>{athlete.fullName}{attendance.koeCode}
            <form onSubmit={handleSubmit}>
                attendances
                <input
                    type="number"
                    min="0"
                    defaultValue={attendance.numOfAttendances}
                    name="numOfAttendances"
                    onChange={handleInput1}
                    required
                /><br />
                lastSprint
                <input
                    type="number"
                    min="0"
                    step="any"
                    defaultValue={athlete.lastSprint}
                    name="lastSprint"
                    onChange={handleInput2}
                    required
                /><br />
                <button>Update</button>
            </form>
        </div>
    )
}
