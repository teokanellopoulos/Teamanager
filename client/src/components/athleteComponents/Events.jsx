import { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "../../css/athlete/Events.css";
import format from "date-fns/format";
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from "date-fns/getDay";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useSelector } from 'react-redux';
import axios from 'axios';
import enUS from 'date-fns/locale/en-US';

const locales = {
    "en-US": enUS
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales
});

export const Events = () => {
    const [events, setEvents] = useState([]);
    const token = useSelector(state => state.token);
    const auth = useSelector(state => state.auth);
    const { athlete } = auth;
    const koeCode = athlete.koeCode;

    useEffect(() => {
        const getMatches = async () => {
            if (koeCode) {
                const events = []
                try {
                    const res = await axios.get("/match/getParticipations", {
                        params: {
                            koeCode
                        },
                        headers: { Authorization: token }
                    });

                    for (let i = 0; i < res.data.length; i++) {
                        events.push({
                            title: "Match with " + res.data[i].opponent,
                            start: new Date(res.data[i].date),
                            end: new Date(res.data[i].date)
                        });
                    }

                    setEvents(events);
                } catch (error) {
                    window.location.href = "/events";
                }
            }
        }
        getMatches();
        // eslint-disable-next-line
    }, [koeCode]);

    return (
        <div className="calendar-container">
            <div className="calendar">
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: 500 }}
                />
            </div>
        </div>
    )
}
