function securePassword(password){
    return password + process.env.SECURE_PASSWORD;
}

module.exports = securePassword;