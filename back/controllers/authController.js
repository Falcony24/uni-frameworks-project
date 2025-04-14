const {verify} = require("jsonwebtoken");
const Users = require("../models/Users");
const Players = require("../models/Players");
const Upgrades = require("../models/Upgrades");
const jwt = require("../util/tokenJW");
const bcrypt = require("bcrypt");
const { usersSchema } = require("../shared/schemas/usersSchema");

exports.tokenVerify = (req, res) => {
    const token = req.cookies.token
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    try {
        verify(token, process.env.SECRET_KEY);
        res.status(204).send();
    } catch (err) {
        res.status(403).json({ message: "Forbidden" })
    }
}

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

        const defaultUpgrade = await Upgrades.findOne({ effect: "CLICK_MULTIPLIER" });
        const newPlayer = new Players({
            user_id: newUser.id,
            upgrades: [
                {
                    upgrade_id: defaultUpgrade._id,
                    level: 1,
                }
            ]
        });

        await newUser.save();
        await newPlayer.save();

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