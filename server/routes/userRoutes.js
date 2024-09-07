const express = require('express'); 
const { handleSignup, handleLogin, handleLogout, handleBalanceUpdate, getUsersForSidebar, sendFriendRequest, acceptFriendRequest } = require('../controllers/userController');
const protectRoute = require('../middlewaares/protectRoute');

const userRouter = express.Router();

userRouter.post('/signup',handleSignup);         //locahost:8000/gameble/signup
userRouter.post('/login', handleLogin)           //locahost:8000/gameble/login
userRouter.post('/logout', handleLogout)           //locahost:8000/gameble/logout
userRouter.put('/updateBalance',protectRoute,handleBalanceUpdate) //locahost:8000/gameble/updateBalance
userRouter.get('/getFriends',protectRoute,getUsersForSidebar);
userRouter.post('/sendRequest',protectRoute,sendFriendRequest);
userRouter.post('./acceptRequest',protectRoute,acceptFriendRequest);


module.exports = userRouter;