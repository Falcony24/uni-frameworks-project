const jwt = require("jsonwebtoken")

exports.generateJWT = async function(user){
    return jwt.sign({
        _id: user.id,
        role: user.role,
    }, process.env.SECRET_KEY, { expiresIn: "2h" })
}