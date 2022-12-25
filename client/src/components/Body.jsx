import { Routes, Route } from "react-router-dom";
import { Login } from "./Login.jsx";
import { Register } from "./Register.jsx";
import { useSelector } from "react-redux";
import { NotFound } from "./NotFound.jsx";
import { Profile } from "./athleteComponents/Profile.jsx";
import { AthleteMainPage } from "./athleteComponents/AthleteMainPage.jsx";
import { DashBoard } from "./adminComponents/DashBoard.jsx";
import { Rankings } from "./Rankings.jsx";
import { EditAthletes } from "./adminComponents/EditAthletes.jsx";
import { ViewPayments } from "./adminComponents/ViewPayments.jsx";
import { ViewMatches } from "./adminComponents/ViewMatches.jsx";
import { CreateMatch } from "./adminComponents/CreateMatch.jsx";
import { EditMatch } from "./adminComponents/EditMatch.jsx";
import { Participations } from "./athleteComponents/Participations.jsx";
import { Statistics } from "./athleteComponents/Statistics.jsx";
import { ViewAthletesInfo } from "./adminComponents/ViewAthletesInfo.jsx";
import { Events } from "./athleteComponents/Events.jsx";
import { StripeContainer } from "./athleteComponents/StripeContainer.jsx";
import { Payments } from "./athleteComponents/Payments.jsx";

export const Body = () => {
    const auth = useSelector(state => state.auth);
    const { isLogged, isAdmin } = auth;
    return (
        <div className="content-wrap">
            <Routes>
                <Route path="/" element={ isAdmin ? <DashBoard/> : <AthleteMainPage/> } />
                <Route path="/login" element={ isLogged ? <p style={{textAlign: "center", margin: "50px"}}>You have to login</p> : <Login/> } />
                <Route path="/register" element={ isLogged ? <p style={{textAlign: "center", margin: "50px"}}>You have to login</p> : <Register/> } />
                <Route path="/profile" element={ !isLogged || isAdmin ? <p style={{textAlign: "center", margin: "50px"}}>You have to login</p> : <Profile/> } />
                <Route path="/updateAthletes" element={ !isLogged || !isAdmin ? <p style={{textAlign: "center", margin: "50px"}}>You have to login</p> : <EditAthletes/> } />
                <Route path="/viewPayments" element={ !isLogged || !isAdmin ? <p style={{textAlign: "center", margin: "50px"}}>You have to login</p> : <ViewPayments/> } />
                <Route path="/viewMatches" element={ !isLogged ? <p style={{textAlign: "center", margin: "50px"}}>You have to login</p> : <ViewMatches/> } />
                <Route path="/createMatch" element={ !isLogged || !isAdmin ? <p style={{textAlign: "center", margin: "50px"}}>You have to login</p> : <CreateMatch/> } />
                <Route path="/editMatch/:id" element={ !isLogged || !isAdmin ? <p style={{textAlign: "center", margin: "50px"}}>You have to login</p> : <EditMatch/> } />
                <Route path="/participations" element={ !isLogged ? <p style={{textAlign: "center", margin: "50px"}}>You have to login</p> : <Participations/> } />
                <Route path="/statistics" element={ !isLogged ? <p style={{textAlign: "center", margin: "50px"}}>You have to login</p> : <Statistics/> } />
                <Route path="/viewAthletesInfo" element={ !isLogged || !isAdmin ? <p style={{textAlign: "center", margin: "50px"}}>You have to login</p> : <ViewAthletesInfo/> } />
                <Route path="/events" element={ !isLogged ? <p style={{textAlign: "center", margin: "50px"}}>You have to login</p> : <Events/> } />
                <Route path="/payMonth" element={ !isLogged ? <p style={{textAlign: "center", margin: "50px"}}>You have to login</p> : <StripeContainer/> } />
                <Route path="/payments" element={ !isLogged ? <p style={{textAlign: "center", margin: "50px"}}>You have to login</p> : <Payments/> } />
                <Route path="*" element={ <NotFound/> } />
            </Routes>
            
        </div>
    )
}
