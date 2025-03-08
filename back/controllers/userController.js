const User = require('../models/Users')
const Player = require('../models/Players')
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

exports.registerUser = async (req, res) => {
    try {
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({ error: "Email already in use" });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const newPlayer = new Player({});
        const savedPlayer = await newPlayer.save();

        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
            player_id: savedPlayer._id
        });

        const savedUser = await newUser.save();

        res.status(201).json({ message: "Account created successfully", user: savedUser });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const user = await User.findOne({
            $or: [{ email: req.body.email }, { username: req.body.username }]
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const passwordCheck = await bcrypt.compare(req.body.password, user.password);
        if (!passwordCheck) {
            return res.status(400).json({ message: "Incorrect credentials" });
        }

        const token = jwt.sign(
            { userId: user._id, userEmail: user.email },
            process.env.JWT_SECRET || "RANDOM-TOKEN",
            { expiresIn: "24h" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: 24 * 60 * 60 * 1000,
        });

        res.status(200).json({ message: "Login successful" });

    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

exports.profileUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select("-password"); // Usuwamy hasło z odpowiedzi
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json({ username: user.username, email: user.email });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}

exports.logoutUser = async (req, res) => {
    res.clearCookie("token", { httpOnly: true, sameSite: "strict", secure: false });
    res.json({ message: "Logged out successfully" });
}

exports.changeCredentials = async (req, res) => {}
exports.deleteUser = async (req, res) => {}
