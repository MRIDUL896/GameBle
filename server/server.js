const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const database = require('./database/dbConnection');
const userRouter = require('./routes/userRoutes');
const cors = require('cors');
const paymentRoutes = require('./routes/paymentRoutes');
const messageRoutes = require('./routes/messageRoutes');
const path = require('path')

__dirname = path.resolve();

const {app , server} =  require('./socket/socket')

database();
dotenv.config();

const corsOptions = {
    origin: "http://localhost:3000", // Allow requests from this origin
    credentials: true, // Allow credentials (cookies, etc.)
  };
app.use(cors({
    origin: "http://localhost:3000", // Allow requests from this origin
    credentials: true, // Allow credentials (cookies, etc.)
}));
app.use(express.json());
app.use(cookieParser());
app.use('/gameble',userRouter);
app.use('/gameble/payment',paymentRoutes);
app.use('/gameble/message',messageRoutes);

app.use(express.static(path.join(__dirname,"../client/build")))

app.get("*", (req,res) => {
    res.sendFile(path.join(__dirname,"client","dist","index.html"))
})
const port = (process.env.PORT) ? process.env.PORT : 8000;
server.listen(port , () => {
    console.log(`backend started at ${port}`);
});