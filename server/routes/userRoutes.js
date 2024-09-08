const express = require('express'); 
const { handleSignup, handleLogin, handleLogout, handleBalanceUpdate, getUsersForSidebar, sendFriendRequest, acceptFriendRequest, getConversations, incomingFriendRequests } = require('../controllers/userController');
const protectRoute = require('../middlewaares/protectRoute');

const userRouter = express.Router();

userRouter.post('/signup',handleSignup);         //localhost:8000/gameble/signup
userRouter.post('/login', handleLogin)           //localhost:8000/gameble/login
userRouter.post('/logout', handleLogout)           //localhost:8000/gameble/logout
userRouter.put('/updateBalance',protectRoute,handleBalanceUpdate) //localhost:8000/gameble/updateBalance
userRouter.get('/getFriends',protectRoute,getUsersForSidebar);
userRouter.get('/getRequests',protectRoute,incomingFriendRequests)
userRouter.post('/sendRequest',protectRoute,sendFriendRequest);
userRouter.post('/acceptRequest',protectRoute,acceptFriendRequest);
userRouter.get('/getConversations',protectRoute,getConversations);


module.exports = userRouter;