import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import axios from "axios";
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

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
            console.log("Hello " + error.message);
        }
    }

    return (
        <div>
            Month: { location.state.month } <br/>
            Year: { location.state.year } <br/>
            <form onSubmit={handleSubmit}>
                <CardElement />
                <button>Pay</button>
            </form>
        </div>
    )
}
