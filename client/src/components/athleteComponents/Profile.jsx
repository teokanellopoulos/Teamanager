import { useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
// import { errorMessage } from "../Notification.jsx";
import { dispatchAthlete, fetchAthlete } from "../../redux/actions/actions.js";

export const Profile = () => {
    
    const initialState = {
        fullName: "",
        yob: "",
        phone: "",
        err: ""
    };

    const auth = useSelector(state => state.auth);
    const token = useSelector(state => state.token);
    const dispatch = useDispatch();
    const { athlete } = auth;
    const [data, setData] = useState(initialState);
    const [display, setDisplay] = useState("block");
    const { fullName, yob, phone, err } = data;

    const handleInput = (e) => {
        const { name, value } = e.target;
        setData({...data, [name]: value, err: ""});
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setDisplay("block");
        try {
            await axios.patch("/athlete/updateProfile", {
                fullName: fullName ? fullName : athlete.fullName,
                yob: yob ? yob : athlete.yob,
                phone: phone ? phone : athlete.phone
            }, {
                headers: { Authorization: token }
            });
            fetchAthlete(token).then(res => {
                dispatch(dispatchAthlete(res));
            });
        } catch (error) {
            setData({...data, err: error.response.data.msg});
            setTimeout(() => {
                setDisplay("none");
            }, 3000);
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text"
                    defaultValue={athlete.fullName}
                    name="fullName"
                    onChange={handleInput}
                /><br/>
                <input 
                    type="number"
                    defaultValue={athlete.yob}
                    min="1980"
                    max="2030"
                    name="yob"
                    onChange={handleInput}
                /><br/>
                <input 
                    type="tel"  
                    defaultValue={athlete.phone}
                    name="phone"
                    onChange={handleInput} 
                /><br/>
                <button type="submit">Change</button>
            </form>
            {/* {err && errorMessage(err, display)} */}
        </div>
    )
}
