const bcrypt = require("bcrypt");
const jwt = require("../util/tokenJW");
const jwt2 = require("jsonwebtoken");
const Users = require("../models/Users");

const verifyToken = (token) => {
    return jwt2.verify(token, process.env.SECRET_KEY, { algorithms: ['HS256'] });
};

const isTokenExpired = (decodedToken) => {
    const now = Math.floor(Date.now() / 1000);
    return decodedToken.exp && decodedToken.exp < now;
};

const checkUserExistence = async (email, username) => {
    return await Users.findOne({ $or: [{ email }, { username }] });
};

const createHashedPassword = async (plainPassword) => {
    return await bcrypt.hash(plainPassword, 10);
};

const checkPassword = async (plainPassword, hashedPassword) => {
    return await bcrypt.compare(plainPassword, hashedPassword);
};

const setTokenCookie = async (res, user) => {
    const token = await jwt.generateJWT(user);
    console.log(token);
    res.cookie("token", token, {
        httpOnly: true,
        maxAge: 2 * 60 * 60 * 1000,
    });
    return token;
};


module.exports = {
    verifyToken,
    isTokenExpired,
    checkUserExistence,
    createHashedPassword,
    checkPassword,
    setTokenCookie,
};
