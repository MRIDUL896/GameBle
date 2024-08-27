const express = require('express'); 
const { handleSignup, handleLogin, handleLogout, handleBalanceUpdate } = require('../controllers/userControllers');

const userRouter = express.Router();

userRouter.post('/signup',handleSignup);         //locahost:8000/gameble/signup
userRouter.post('/login', handleLogin)           //locahost:8000/gameble/login
userRouter.post('/logout', handleLogout)           //locahost:8000/gameble/logout
userRouter.put('/updateBalance',handleBalanceUpdate) //locahost:8000/gameble/updateBalance


module.exports = userRouter;