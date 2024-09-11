import React, { useState } from 'react';
import { Coins } from 'lucide-react';
import api from '../Components/axiosConfig'
import { useSelector } from 'react-redux';

const Shop = () => {
  const [selectedAmount, setSelectedAmount] = useState(null);

  const coinPackages = [
    { amount: 100, price: 0.99 },
    { amount: 500, price: 4.99 },
    { amount: 1000, price: 9.99 },
  ];

  const {userInfo} = useSelector((state) => state.user);

    const handlePayment = async () => {
        if (!selectedAmount) {
            alert('Invalid amount');
            return;
        }
        try {
            const orderResponse = await api.post(`/gameble/payment/create-order`, {
                amount: selectedAmount
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
                        const verifyResponse = await api.post(`/gameble/payment/verify-payment`, response);
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
    <div className="flex flex-col items-center justify-center p-4 m-8 w-[95%] bg-gray-800 text-gray-100 font-sans rounded-lg">
      <h2 className="text-3xl font-bold mb-4 text-center text-blue-300">Coin Shop</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-[90%]">
        {coinPackages.map((pkg) => (
          <div 
            key={pkg.amount} 
            onClick={() => setSelectedAmount(pkg)}
            className={`cursor-pointer bg-gray-950 hover:bg-gray-600 transition-colors rounded-lg p-4 text-center ${
              selectedAmount === pkg ? 'ring-2 ring-blue-400' : ''
            }`}
          >
            <h3 className="text-lg text-blue-200 mb-2">{pkg.amount} Coins</h3>
            <Coins className="mx-auto mb-2 text-yellow-400" size={32} />
            <p className="font-bold text-green-300">${pkg.price}</p>
          </div>
        ))}
      </div>
      <button 
        onClick={handlePayment}
        disabled={!selectedAmount}
        className={`w-[90%] mt-4 py-2 rounded ${
          selectedAmount
            ? 'bg-blue-600 hover:bg-blue-500 cursor-pointer'
            : 'bg-gray-600 cursor-not-allowed'
        } text-white transition-colors`}
      >
        {selectedAmount ? `Buy ${selectedAmount.amount} Coins` : 'Select a Package'}
      </button>
    </div>
  );
};

export default Shop;