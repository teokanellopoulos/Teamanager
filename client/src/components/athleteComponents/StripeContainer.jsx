import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from '@stripe/stripe-js';
import { PaymentForm } from './PaymentForm';

export const StripeContainer = () => {
    const PUBLIC_KEY = "pk_test_51LYK5cHEAWsBvTb4aIe18HiBEH8Ub8uE2aHiS8PQjj9iivCNSykAQteFKB3CO6m8ud7MsX6m3h2zAJwmbdzm2laQ00V9I3yZqy";
    const stripeTestPromise = loadStripe(PUBLIC_KEY);

    return (
        <Elements stripe={stripeTestPromise}>
            <PaymentForm/>
        </Elements>
    )
}
