const pswdStrength = (password) => {
    const minLength = 6;
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNum = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    if(password.length>=minLength&&hasLower&&hasUpper&&hasNum&&hasSpecial) return "strong";
    return "weak";
}

module.exports = pswdStrength;