import axios from "axios";

export const dispatchLogIn = () => {
    return {
        type: "LOGIN"
    }
}

export const fetchAthlete = async (token) => {
    const res = await axios.get("/athlete/athleteInfo", {
        headers: {Authorization: token}
    });

    return res;
}

export const dispatchAthlete = (res) => {
    return {
        type: "GET_ATHLETE",
        payload: {
            athlete: res.data,
            isAdmin: res.data.role === 1 ? true : false
        }
    };
}