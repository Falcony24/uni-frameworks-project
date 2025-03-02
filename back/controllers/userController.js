const User = require('../models/User')
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

exports.registerUser = async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        console.log(hashedPassword)
        const user = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
        })

        const result = await user.save()
        res.status(201).send({ message: "Account created successfully", result })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

exports.loginUser = async (req, res) => {
    try {
        const user = await User.findOne({
            $or: [{ email: req.body.email }, { username: req.body.username }]
        })

        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        const passwordCheck = await bcrypt.compare(req.body.password, user.password)
        if (!passwordCheck) {
            return res.status(400).json({ message: "Incorrect password" })
        }

        const token = jwt.sign(
            { userId: user._id, userEmail: user.email },
            "RANDOM-TOKEN",
            { expiresIn: "24h" }
        )

        res.status(200).json({
            message: "Login successful",
            email: user.email,
            token,
        })

    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message })
    }
}