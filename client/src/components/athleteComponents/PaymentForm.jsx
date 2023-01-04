import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import axios from "axios";
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import "../../css/athlete/PaymentForm.css";

export const PaymentForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const auth = useSelector(state => state.auth);
    const token = useSelector(state => state.token);
    const location = useLocation();
    const navigate = useNavigate();
    const { email } = auth.athlete;

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: "card",
            card: elements.getElement(CardElement)
        });

        if (!error) {
            try {
                const { id } = paymentMethod;
                await axios.post("payment/payMonth", {
                    amount: 3000,
                    id,
                    email,
                    koeCode: location.state.koeCode,
                    month: parseInt(location.state.month),
                    year: parseInt(location.state.year)
                }, {
                    headers: { Authorization: token }
                });
                navigate("/payments");
            } catch (error) {
                console.log(error);
            }
        } else {
            window.location.href = "/payments";
        }
    }

    return (
        <div className="payment-container">
            <h3>Enter your card data</h3>
            <form onSubmit={handleSubmit} className="payment-form-user">
                <div style={{marginBottom: "10px", color: "black"}}> Month to pay {location.state.month}/{location.state.year}</div>
                <CardElement />
                <button className="update">Pay</button>
            </form>
        </div>
    )
}
