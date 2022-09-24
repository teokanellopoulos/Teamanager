import { Routes, Route } from "react-router-dom";
import { Login } from "./Login.js";
import { Register } from "./Register.js";
import { useSelector } from "react-redux";
import { NotFound } from "./NotFound.js";
import { Profile } from "./athleteComponents/Profile.js";
import { AthleteMainPage } from "./athleteComponents/AthleteMainPage.js";
import { DashBoard } from "./adminComponents/DashBoard.js";
import { Rankings } from "./Rankings.js";
import { EditAthletes } from "./adminComponents/EditAthletes.js";
import { ViewPayments } from "./adminComponents/ViewPayments.js";
import { ViewMatches } from "./adminComponents/ViewMatches.js";
import { CreateMatch } from "./adminComponents/CreateMatch.js";
import { EditMatch } from "./adminComponents/EditMatch.js";
import { Participations } from "./athleteComponents/Participations.js";
import { Statistics } from "./athleteComponents/Statistics.js";
import { ViewAthletesInfo } from "./adminComponents/ViewAthletesInfo.js";
import { Events } from "./athleteComponents/Events.js";
import { StripeContainer } from "./athleteComponents/StripeContainer.js";
import { Payments } from "./athleteComponents/Payments.js";

export const Body = () => {
    const auth = useSelector(state => state.auth);
    const { isLogged, isAdmin } = auth;
    return (
        <section>
            <Routes>
                <Route path="/" element={ isAdmin ? <DashBoard/> : <AthleteMainPage/> } />
                <Route path="/rankings" element={ !isLogged ? <NotFound/> : <Rankings/> } />
                <Route path="/login" element={ isLogged ? <NotFound/> : <Login/> } />
                <Route path="/register" element={ isLogged ? <NotFound/> : <Register/> } />
                <Route path="/profile" element={ !isLogged || isAdmin ? <NotFound/> : <Profile/> } />
                <Route path="/updateAthletes" element={ !isLogged || !isAdmin ? <NotFound/> : <EditAthletes/> } />
                <Route path="/viewPayments" element={ !isLogged || !isAdmin ? <NotFound/> : <ViewPayments/> } />
                <Route path="/viewMatches" element={ !isLogged ? <NotFound/> : <ViewMatches/> } />
                <Route path="/createMatch" element={ !isLogged || !isAdmin ? <NotFound/> : <CreateMatch/> } />
                <Route path="/editMatch/:id" element={ !isLogged || !isAdmin ? <NotFound/> : <EditMatch/> } />
                <Route path="/participations" element={ !isLogged ? <NotFound/> : <Participations/> } />
                <Route path="/statistics" element={ !isLogged ? <NotFound/> : <Statistics/> } />
                <Route path="/viewAthletesInfo" element={ !isLogged || !isAdmin ? <NotFound/> : <ViewAthletesInfo/> } />
                <Route path="/events" element={ !isLogged ? <NotFound/> : <Events/> } />
                <Route path="/payMonth" element={ !isLogged ? <NotFound/> : <StripeContainer/> } />
                <Route path="/payments" element={ !isLogged ? <NotFound/> : <Payments/> } />
            </Routes>
        </section>
    )
}
