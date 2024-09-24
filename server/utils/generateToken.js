const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const generateTokenAndSetCookie = (userId, res) => {
	const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
		expiresIn: "15d",
	});

	console.log(token)

	res.cookie("jwt", token, {
		maxAge: 15 * 24 * 60 * 60 * 1000,
	});
};

module.exports = generateTokenAndSetCookie;