import React, { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { AthleteNavBar } from "./components/athleteComponents/AthleteNavBar.jsx";
import { Body } from "./components/Body.jsx";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import "./App.css";
import { dispatchLogIn, dispatchAthlete, fetchAthlete } from "./redux/actions/actions.js";
import { AdminNavBar } from "./components/adminComponents/AdminNavBar.jsx";
import { Footer } from "./components/athleteComponents/Footer.jsx";
axios.defaults.baseURL = "http://localhost:5000";

export const App = () => {
    const dispatch = useDispatch();
    const token = useSelector(state => state.token);
    const auth = useSelector(state => state.auth);

    useEffect(() => {
        const firstLogin = localStorage.getItem("firstLogin");
        if (firstLogin) {
            const getToken = async () => {
                try {
                    const response = await fetch("http://localhost:5000/athlete/refreshToken", {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        credentials: "include"
                    });

                    const data = await response.json();

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.msg);
                    }
                    dispatch({ type: "GET_TOKEN", payload: data.accessToken });
                } catch (error) {
                    console.log("This is error from app" + error.message)
                }
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
