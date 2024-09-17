const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const database = require('./database/dbConnection');
const userRouter = require('./routes/userRoutes');
const cors = require('cors');
const paymentRoutes = require('./routes/paymentRoutes');
const messageRoutes = require('./routes/messageRoutes');

const {app , server} =  require('./socket/socket')

database();
dotenv.config();

app.use(cors({
    origin: 'http://localhost:3000', // Replace with your frontend's URL
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(cookieParser());
app.use('/gameble',userRouter);
app.use('/gameble/payment',paymentRoutes);
app.use('/gameble/message',messageRoutes);

const port = (process.env.PORT) ? process.env.PORT : 8000;
server.listen(port , () => {
    console.log(`backend started at ${port}`);
});