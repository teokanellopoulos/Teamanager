import { useState } from 'react';
import axios from "axios";
import { useSelector } from "react-redux";
import { errorMessage, successMessage } from '../Notification.jsx';

export const ViewPayments = () => {
    const initialState = {
        month: "",
        year: "",
        err: "",
        suc: ""
    };

    const [input, setInput] = useState(initialState);
    const [display, setDisplay] = useState("block");
    const [checked, setChecked] = useState(false);
    const [payments, setPayments] = useState([]);
    const token = useSelector(state => state.token);

    const { month, year, err, suc } = input;

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.get("/payment/getPayments", {
                params: {
                    month: month,
                    year: year
                },
                headers: { Authorization: token }
            });

            setPayments(res.data);
        } catch (error) {
            setPayments("An error has occured")
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInput({ ...input, [name]: value });
    }

    const handleCheck = () => {
        setChecked(!checked);
    }

    const handleClick = async () => {
        setDisplay("block");
        try {
            const res = await axios.post("/payment/newYearPayments", {}, { headers: { Authorization: token } });
            setInput({ ...input, suc: res.data.msg, err: ""});
        } catch (error) {
            setInput({ ...input, err: error.response.data.msg, suc: "" });
        }
        setTimeout(() => {
            setDisplay("none");
        }, 3000);
    }

    return (
        <div>ViewPayments
            <form onSubmit={handleSubmit}>
                <input
                    type="number"
                    min="1"
                    max="12"
                    name="month"
                    required
                    value={month}
                    onChange={handleChange}
                    placeholder="Enter month (1-12)"
                />
                <input
                    type="number"
                    min="2022"
                    name="year"
                    required
                    value={year}
                    onChange={handleChange}
                    placeholder="Enter year (from 2022 and so on)"
                />
                <button>Search</button>
            </form>
            <br />
            Check to see who has paid, uncheck to see who hasn't
            <input
                type="checkbox"
                name="choice"
                value="choice"
                checked={checked}
                onChange={handleCheck}
            /><br />
            <div>
                {payments.length !== 0 ? 
                    checked ?
                        payments.filter(payment => payment.paid === true).length !== 0 ?
                            payments.filter(payment => payment.paid === true).map((item, i) =>
                                <p key={i}>{item.fullName} &nbsp;&nbsp; Payed</p>) 
                        : "No one has paid this month" :
                        payments.filter(payment => payment.paid !== true).length !== 0 ? 
                            payments.filter(payment => payment.paid !== true).map((item, i) =>
                                <p key={i}>{item.fullName} &nbsp;&nbsp; Hasn't payed</p>) 
                        : "Everyone has paid this month"
                :
                "No results"}
            </div>
            <button onClick={handleClick}>Add new year payments</button>
            <br/>
            {err && errorMessage(err, display)}
            {suc && successMessage(suc, display)}
        </div>
    )
}
