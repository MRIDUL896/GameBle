const generateFriendCode = (id) => {
    return id + Math.floor(Math.random()*100);
}

module.exports = generateFriendCode;