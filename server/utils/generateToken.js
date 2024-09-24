const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const generateTokenAndSetCookie = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "15d",
    });

    console.log(token);

    res.cookie("jwt", token, {
        maxAge: 15 * 24 * 60 * 60 * 1000,
        httpOnly: true,  // Prevents client-side access to the cookie
        secure: true,  // Set to true if in production
		path: '/',  // Cookie is accessible on all routes
    });
	return token
};

module.exports = generateTokenAndSetCookie;