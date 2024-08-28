const express = require('express');
const dotenv = require('dotenv');
const database = require('./database/dbConnection');
const userRouter = require('./routes/userRoutes');
const cors = require('cors');
const paymentRoutes = require('./routes/paymentRoutes');

const app = express();
database();
dotenv.config();

app.use(cors());
app.use(express.json());
app.use('/gameble',userRouter);
app.use('/gameble/payment',paymentRoutes);

const port = (process.env.PORT) ? process.env.PORT : 8000;
app.listen(port , () => {
    console.log(`backend started at ${port}`);
});