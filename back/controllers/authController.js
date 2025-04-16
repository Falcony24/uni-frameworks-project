const Users = require("../models/Users");
const Players = require("../models/Players");
const Upgrades = require("../models/Upgrades");
const jwt = require("../util/tokenJW");
const bcrypt = require("bcrypt");
const { usersSchema } = require("../shared/schemas/usersSchema");
const jwt2 = require('jsonwebtoken');

exports.tokenVerify = async (req, res) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "Access denied, no token provided" });
    }

    try {
        const decoded = jwt2.verify(token, process.env.SECRET_KEY, { algorithms: ['HS256'] });

        req.user = decoded;

        const now = Math.floor(Date.now() / 1000);
        if (decoded.exp && decoded.exp < now) {
            return res.status(401).json({ message: "Token expired" });
        }

        return res.status(200).json({ role: decoded.role });

    } catch (err) {
        console.log(err)
        let status = 403;
        let message = "Forbidden";
        let code = "INVALID_TOKEN";

        if (err instanceof jwt2.TokenExpiredError) {
            status = 401;
            message = "Token expired";
            code = "TOKEN_EXPIRED";
        } else if (err instanceof jwt2.JsonWebTokenError) {
            status = 400;
            message = "Invalid token";
            code = "MALFORMED_TOKEN";
        }

        return res.status(status).json({ message, code });
    }
};

exports.signUp = async (req, res) => {
    try {
        const result = usersSchema.safeParse(req.body);

        if (!result.success) {
            return res.status(400).json({ message: "Invalid data" });
        }

        const { username, email, password } = result.data;

        const existingUser = await Users.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ message: "Email or username already in use" });
        }

        const newUser = new Users({
            username: username,
            email: email,
            password: password,
        });

        const defaultUpgrade = await Upgrades.findOne({ effect: "CLICK_POWER" });
        const newPlayer = new Players({
            user_id: newUser._id,
            upgrades: [
                {
                    upgrade_id: defaultUpgrade.id,
                    level: 1,
                }
            ]
        });

        console.log("a")
        await newUser.save();
        console.log("b")

        await newPlayer.save();
        console.log("c")

        res.cookie("token", await jwt.generateJWT(newUser), {
            httpOnly: true,
            maxAge: 2 * 60 * 60 * 1000, // 2 godziny
        })
            .status(201)
            .json({ message: "Account created successfully" });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: "Email or username already in use" });
        }
        console.log(error)
        res.status(500).json({ error: error.message });
    }
}


exports.signIn = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await Users.findOne({
            $or: [{ email: username }, { username: username }],
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const passwordCheck = await bcrypt.compare(password, user.password);
        if (!passwordCheck) {
            return res.status(400).json({ message: "Incorrect credentials" });
        }

        res.cookie("token", await jwt.generateJWT(user), {
            httpOnly: true,
            maxAge: 2 * 60 * 60 * 1000,
        })
            .status(200)
            .json({ message: "Logged succesfully" });

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

exports.logoutUser = async (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        sameSite: "strict",
    });
    res.status(200).json({ message: 'Logged out' });
}