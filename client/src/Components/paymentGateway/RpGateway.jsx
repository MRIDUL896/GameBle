import React from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const RpGateway = ({ amount }) => {

    const {userInfo} = useSelector((state) => state.user);

    const handlePayment = async () => {
        if (!amount) {
            alert('Invalid amount');
            return;
        }

        try {
            const orderResponse = await axios.post(`http://localhost:8000/gameble/payment/create-order`, {
                amount: amount
            });
            const { data } = orderResponse;

            const options = {
                key: process.env.RAZORPAY_KEY_ID, // Accessing the key from the .env file
                amount: data.amount,
                currency: data.currency,
                name: 'Test Company',
                description: 'Test Transaction',
                order_id: data.id,
                handler: async function (response) {
                    try {
                        const verifyResponse = await axios.post(`${process.env._API_URL}/gameble/payment/verify-payment`, response);
                        console.log(verifyResponse.data);
                        alert('Payment successful');
                    } catch (error) {
                        console.error('Verification error:', error);
                        alert('Payment verification failed');
                    }
                },
                prefill: {
                    name: userInfo.name,
                    email: userInfo.email,
                    contact: userInfo.phoneNo
                },
                theme: {
                    color: '#3399cc'
                }
            };

            const rzp1 = new window.Razorpay(options);
            rzp1.open();
        } catch (error) {
            console.error('Error:', error);
            alert('Error creating order');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Razorpay Test Integration</h1>
            <button
                onClick={handlePayment}
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
                Pay ₹{amount}
            </button>
        </div>
    );
}

export default RpGateway;
