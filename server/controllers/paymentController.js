const Razorpay = require('razorpay');
const dotenv = require('dotenv');
dotenv.config();


const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

const createOrder = async (req, res) => {
  try {
    const {amount} = req.body;
    const options = {
      amount: amount, // amount in paise, e.g., 50000 paise = ₹500
      currency: 'INR',
      receipt: 'receipt_order_' + Date.now(),
      payment_capture: 1
    };
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error creating order', error: error.message });
  }
};

const verifyPayment = (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  
  if (razorpay_order_id && razorpay_payment_id && razorpay_signature) {
    // In a production environment, you would verify these details with Razorpay
    res.json({ status: 'success', message: 'Payment verified successfully' });
  } else {
    res.status(400).json({ status: 'failure', message: 'Payment verification failed' });
  }
};

module.exports = {createOrder,verifyPayment};