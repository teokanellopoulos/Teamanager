import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays, faIdCard, faUser } from "@fortawesome/free-solid-svg-icons";

export const Payments = () => {
    const token = useSelector(state => state.token);
    const [payments, setPayments] = useState([]);
    const auth = useSelector(state => state.auth);
    const { athlete } = auth;
    const navigate = useNavigate();
    const [checked, setChecked] = useState(false);
    const koeCode = athlete.koeCode;

    useEffect(() => {
        const getMatches = async () => {
            if (koeCode) {
                try {
                    const res = await axios.get("/payment/getAthletePayments", {
                        params: {
                            koeCode
                        },
                        headers: { Authorization: token }
                    });
                    setPayments(res.data);
                } catch (error) {
                    window.location.href = "/payments";
                }
            }
        }
        getMatches();
        // eslint-disable-next-line
    }, [koeCode]);

    const handleCheck = () => {
        setChecked(!checked);
    }

    const handleClick = (payment) => {
        navigate("/payMonth", { state: { month: payment.month, year: payment.year, koeCode: koeCode } })
    }

    return (
        <div className="payments-container">
            <label>
                Check to see your payments, uncheck to see which months you owe
                <input
                    type="checkbox"
                    name="choice"
                    value="choice"
                    checked={checked}
                    onChange={handleCheck}
                /><br />
            </label>
            {
                payments.length !== 0 ?
                    checked ?
                        payments.filter(payment => payment.paid === true).map((payment, i) =>
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
                        :
                        payments.filter(payment => payment.paid !== true && payment.attended === true).map((payment, i) =>
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
                                    <p>Status: {payment.paid ? "Paid" : "Haven't paid"}</p>
                                </div>
                                <button onClick={() => handleClick(payment)} className="update" style={{marginLeft: "10px"}}>
                                    Pay month</button>
                            </motion.div>)
                    :
                    "No results"
            }
        </div>
    )
}
