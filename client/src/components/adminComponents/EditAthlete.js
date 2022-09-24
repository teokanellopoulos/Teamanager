import { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

export const EditAthlete = ({ athlete }) => {
    const token = useSelector(state => state.token);
    const [updatedAthlete, setUpdatedAthlete] = useState(athlete);

    const handleInput = (e) => {
        const { name, value } = e.target;  
        setUpdatedAthlete({...updatedAthlete, [name]: value});
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.patch("/athlete/updateAthlete", {updatedAthlete}, {
                headers: { Authorization: token }
            });
        } catch (error) {
            console.log(error.response.data.msg)
        }
    }

    return (
        <div>{athlete.fullName}
            <form onSubmit={handleSubmit}>
                attendances
                <input
                    type="number"
                    min="0"
                    defaultValue={athlete.attendances}
                    name="attendances"
                    onChange={handleInput}
                    required
                /><br />
                lastSprint
                <input
                    type="number"
                    min="0"
                    step="any"
                    defaultValue={athlete.lastSprint}
                    name="lastSprint"
                    onChange={handleInput}
                    required
                /><br />
                <button>Update</button>
            </form>
        </div>
    )
}
