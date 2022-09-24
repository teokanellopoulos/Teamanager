import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export const Payments = () => {
    const token = useSelector(state => state.token);
    const [payments, setPayments] = useState([]);
    const auth = useSelector(state => state.auth);
    const { athlete } = auth;
    const navigate = useNavigate();
    const [checked, setChecked] = useState(false);
    const id = athlete._id;

    useEffect(() => {
        const getMatches = async () => {
            if (id) {
                try {
                    const res = await axios.get("/payment/getAthletePayments", {
                        params: {
                            id
                        },
                        headers: { Authorization: token }
                    });
                    setPayments(res.data);
                } catch (error) {
                }
            }
        }
        getMatches();
        // eslint-disable-next-line
    }, [auth.athlete._id]);

    const handleCheck = () => {
        setChecked(!checked);
    }

    const handleClick = (payment) => {
        navigate("/payMonth", { state: { month: payment.month, year: payment.year, aid: id } })
    }

    return (
        <div>
            Check to see your payments, uncheck to see which months you owe
            <input
                type="checkbox"
                name="choice"
                value="choice"
                checked={checked}
                onChange={handleCheck}
            /><br />
            {
                payments.length !== 0 ?
                    checked ?
                        payments.filter(payment => payment.paid === true).length !== 0 ?
                            payments.filter(payment => payment.paid === true).map((item, i) =>
                                <p key={i}>{item.fullName} &nbsp;&nbsp; Payed</p>)
                            : "You haven't made any payments" :
                        payments.filter(payment => payment.paid !== true).length !== 0 ?
                            payments.filter(payment => payment.paid !== true).map((item, i) =>
                                <p key={i}>{item.fullName} &nbsp;&nbsp;<button onClick={() => handleClick(item)}>Pay month</button></p>)
                            : "You don't owe any months"
                    :
                    "No results"
            }
        </div>
    )
}
