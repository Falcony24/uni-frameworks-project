const jwt = require("jsonwebtoken")
require('dotenv').config({ path: '.env.development' });

exports.generateJWT = async function(user){
    console.log(process.env.SECRET_KEY)
    return jwt.sign({
        _id: user.id,
        role: user.role,
    }, process.env.SECRET_KEY, { expiresIn: "2h" })
}