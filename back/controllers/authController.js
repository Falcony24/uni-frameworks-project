const {
    verifyToken,
    isTokenExpired,
} = require("../util/authUtil");
const { signUp, signIn } = require("../services/authService");

exports.tokenVerify = async (req, res) => {
    const token = req.cookies.token;

    if (!token) return res.status(401).json({ message: "Access denied, no token provided" });
    console.log(token);
    console.log(req.cookies);
    try {
        const decoded = verifyToken(token);
        req.user = decoded;

        if (isTokenExpired(decoded)) {
            return res.status(401).json({ message: "Token expired" });
        }

        return res.status(200).json({ role: decoded.role });
    } catch (err) {
        console.log(err);
        let status = 403, message = "Forbidden", code = "INVALID_TOKEN";

        if (err.name === "TokenExpiredError") {
            status = 401; message = "Token expired"; code = "TOKEN_EXPIRED";
        } else if (err.name === "JsonWebTokenError") {
            status = 400; message = "Invalid token"; code = "MALFORMED_TOKEN";
        }

        return res.status(status).json({ message, code });
    }
};

exports.signUp = async (req, res) => {
    try {
        await signUp(req, res);
    } catch (error) {
        console.log(error);
        if (error.code === 11000) {
            return res.status(400).json({ message: "Email or username already in use" });
        }
        return res.status(500).json({ error: error.message });
    }
};

exports.signIn = async (req, res) => {
    try {
        await signIn(req, res);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};


exports.logoutUser = async (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        sameSite: "strict",
    });
    return res.status(200).json({ message: 'Logged out' });
};
