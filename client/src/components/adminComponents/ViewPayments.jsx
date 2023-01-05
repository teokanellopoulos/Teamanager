import { useState } from 'react';
import axios from "axios";
import { ErrorMessage } from "../Notification.jsx";
import { useSelector } from "react-redux";
import "../../css/admin/ViewPayments.css";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays, faIdCard, faUser } from "@fortawesome/free-solid-svg-icons";

export const ViewPayments = () => {
    const initialState = {
        month: "",
        year: ""
    };

    const [input, setInput] = useState(initialState);
    const [checked, setChecked] = useState(false);
    const [payments, setPayments] = useState([]);
    const [nonPayers, setNonPayers] = useState([]);
    const token = useSelector(state => state.token);
    const [err, setErr] = useState("");
    const [display, setDisplay] = useState(true);

    const { month, year } = input;

    useEffect(() => {
        const getAllNonPayers = async () => {
            try {
                const res = await axios.get("/payment/getAllNonPayers", {
                    headers: { Authorization: token }
                });
                setNonPayers(res.data);
            } catch (error) {
                window.location.href = "/viewPayments";
            }
        }

        getAllNonPayers();
        // eslint-disable-next-line
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setDisplay(true);
            setErr("");
            const res = await axios.get("/payment/getPayments", {
                params: {
                    month: month,
                    year: year
                },
                headers: { Authorization: token }
            });

            setPayments(res.data);
        } catch (error) {
            if (error.response.data.msg === "Invalid token") {
                window.location.href = "/viewPayments";
            } else {
                setErr(error.response.data.msg);
                setDisplay(false);
            }
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInput({ ...input, [name]: value });
    }

    const handleCheck = () => {
        setChecked(!checked);
    }

    return (
        <div className="payments-container">
            <ErrorMessage msg={err} className={display} />
            <label>Check to see monthly payments, uncheck to see all who haven't payed
                <input
                    type="checkbox"
                    name="choice"
                    value="choice"
                    checked={checked}
                    onChange={handleCheck}
                    className="checkbox"
                />
            </label>
            {
                checked ?
                    <div className="month-payments">
                        <h3 className="header">View monthly payments</h3>
                        <form onSubmit={handleSubmit} className="payment-form">
                            Enter month (1-12)<br />
                            <input
                                type="number"
                                min="1"
                                name="month"
                                required
                                value={month}
                                onChange={handleChange}
                                className="number-field"
                            /><br />
                            Enter year (starting from 2020)<br />
                            <input
                                type="number"
                                name="year"
                                required
                                value={year}
                                onChange={handleChange}
                                className="number-field"
                            /><br />
                            <button className="search">Search</button>
                        </form>
                        {
                            payments.map((payment, i) =>
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, translateX: -50 }}
                                    animate={{ opacity: 1, translateX: 0 }}
                                    transition={{ duration: 0.5, delay: i * 0.1 }}
                                    className="payment-card"
                                    style={{ backgroundColor: payment.paid ? "#116a0b" : "#920e0e" }}
                                >
                                    {i + 1}.
                                    <div className="card-data-payment">
                                        <FontAwesomeIcon icon={faUser} /> {payment.fullName}<br />
                                        <FontAwesomeIcon icon={faIdCard} /> {payment.koeCode}<br />
                                        <FontAwesomeIcon icon={faCalendarDays} /> {payment.month}/{payment.year}
                                        <p>Status: {payment.paid ? "Paid" : "Hasn't paid"}</p>
                                    </div>
                                </motion.div>)
                        }
                    </div>
                    :
                    <div className="non-payers">
                        {
                            nonPayers.map((nonPayer, i) =>
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, translateX: -50 }}
                                    animate={{ opacity: 1, translateX: 0 }}
                                    transition={{ duration: 0.5, delay: i * 0.1 }}
                                    className="payment-card"
                                    style={{ backgroundColor: nonPayer.paid ? "#116a0b" : "#920e0e" }}
                                >
                                    {i + 1}.
                                    <div className="card-data-payment">
                                        <FontAwesomeIcon icon={faUser} /> {nonPayer.fullName}<br />
                                        <FontAwesomeIcon icon={faIdCard} /> {nonPayer.koeCode}<br />
                                        <FontAwesomeIcon icon={faCalendarDays} /> {nonPayer.month}/{nonPayer.year}
                                        <p>Status: Hasn't paid</p>
                                    </div>
                                </motion.div>)
                        }
                    </div>
            }
        </div>
    )
}
