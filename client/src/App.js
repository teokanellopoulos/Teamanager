import React, { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { AthleteNavBar } from "./components/athleteComponents/AthleteNavBar.js";
import { Body } from "./components/Body";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import "./App.css";
import { Footer } from "./components/athleteComponents/Footer.js"
import { dispatchLogIn, dispatchAthlete, fetchAthlete } from "./redux/actions/actions.js";
import { AdminNavBar } from "./components/adminComponents/AdminNavBar.js";

export const App = () => {
    const dispatch = useDispatch();
    const token = useSelector(state => state.token);
    const auth = useSelector(state => state.auth);

    useEffect(() => {
        const firstLogin = localStorage.getItem("firstLogin");
        if (firstLogin) {
            const getToken = async () => {
                const res = await axios.post("/athlete/refreshToken", null);
                dispatch({ type: "GET_TOKEN", payload: res.data.accessToken });
            }
            getToken();
        }
    }, [auth.isLogged, dispatch]);

    useEffect(() => {
        if (token) {
            const getAthlete = () => {
                dispatch(dispatchLogIn());

                return fetchAthlete(token).then(res => {
                    dispatch(dispatchAthlete(res));
                });
            }
            getAthlete();
        }
    }, [token, dispatch]);

    return (
        <div className="App">
            <BrowserRouter>
                {auth.isAdmin ? <AdminNavBar /> : <AthleteNavBar />}
                <Body />
            </BrowserRouter>
            {!auth.isAdmin && <Footer />}
        </div>
    );
}
