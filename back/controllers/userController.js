const Users = require('../models/Users')
const Players = require('../models/Players')
const mongoose = require("mongoose");
const {hash, compare} = require("bcrypt");

require('dotenv').config()

exports.profile = async (req, res) => {
    try {
        const user_id = req.params.id || req.user._id;

        console.log(req.params.id, req.user.role, req.user._id)
        if (req.params.id && req.user.role !== "ADMIN" && req.params.id !== req.user._id.toString()) {
            return res.status(403).json({ message: "Forbidden: Access denied" });
        }

        const user = await Users.findById(user_id)
            .select("username email role created_at customer")
        if (!user) return res.status(404).json({ message: "User not found" });

        const player = await Players.findOne({ user_id });

        res.status(200).json({
            userId: user._id,
            user: user,
            player: player || null,
            customer: user.customer || null,
        });

    } catch (error) {
        console.error("Profile Fetch Error:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

exports.getProfileData = async (req, res) => {
    const { type } = req.params;
    const user_id = req.params.id || req.user._id;

    if(!mongoose.Types.ObjectId.isValid(user_id))
        return res.status(400).json({ message: "Invalid id" });

    try {
        let data = null;

        switch (type) {
            case "users":
                data = await Users.findById(user_id)
                break;
            case "players":
                data = await Players.findOne({ user_id: user_id});
                break;
            case "customers":
                data = {};
                break;
            default:
                return res.status(400).json({ message: "Invalid data type" });
        }

        res.status(200).json(data);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

exports.putData = async (req, res) => {
    const { type } = req.params;
    const user_id = req.user._id;
    const newData = req.body;

    try {
        let Model;

        switch (type) {
            case 'users':
                Model = Users;
                break;
            case 'players':
                Model = Players;
                break;
            default:
                return res.status(400).json({ error: 'Invalid data type' });
        }

        const fullData = { ...newData, user_id };
        console.log("full data", fullData, user_id);
        const updatedDoc = await Model.findOneAndReplace(
            { user_id },
            fullData,
            { new: true, upsert: true }
        );

        res.json(updatedDoc);
    } catch (err) {
        res.status(500).json({ error: 'Internal server error', err });
    }
}

exports.changeUserData = async (req, res) => {
    const type = req.params.type;
    const data = req.body;
    const user_id = req.params.id || req.user._id;

    if (!mongoose.Types.ObjectId.isValid(user_id))
        return res.status(400).json({ message: "Invalid ID" });

    const isAdmin = req.user.role === "ADMIN";
    const isSelf = req.params.id === undefined || req.params.id === req.user._id.toString();

    if (req.params.id && !isAdmin && !isSelf) {
        return res.status(403).json({ message: "Forbidden: Access denied" });
    }

    try {
        let updated;
        let existing;

        switch (type) {
            case "users":
                if (!isAdmin) {
                    const allowedFields = ["username", "password", "newPassword"];
                    const keys = Object.keys(data);
                    const isValidUpdate = keys.every(key => allowedFields.includes(key));

                    if (!isValidUpdate) {
                        return res.status(403).json({
                            message: "You are allowed to change only username or password"
                        });
                    }
                }

                if (data.password) {
                    let pass = await Users.findOne({ _id: user_id }).select("password")
                    if (!await compare(data.password, pass.password))
                        return res.status(400).json({ message: "Invalid old password" });


                    let newPass = data.newPassword

                    data.password = await hash(newPass, 12);
                }

                existing = await Users.findById(user_id);

                updated = await Users.findOneAndUpdate(
                    { _id: user_id },
                    { $set: data },
                    { returnDocument: 'after' }
                );
                break;

            case "players":
                existing = await Players.findOne({ user_id: user_id });
                updated = await Players.findOneAndUpdate(
                    { user_id: user_id },
                    { $set: data },
                    { returnDocument: 'after' }
                );
                break;

            default:
                return res.status(400).json({ message: "Unknown update type" });
        }

        if (!updated) {
            return res.status(404).json({ message: "Document not found" });
        }

        if (existing && JSON.stringify(existing.toObject()) === JSON.stringify(updated.toObject())) {
            return res.status(204).json({ message: "No changes made" });
        }

        res.status(200).json({ message: "Update successful", data: updated });
    } catch (error) {
        console.error("Update error:", error);
        res.status(500).json({ message: "Update failed", error: error.message });
    }
};


exports.deleteProfile = async (req, res) => {
    try {
        const user_id = req.params.id || req.user._id;

        if (req.params.id && req.user.role !== "ADMIN" && req.params.id !== req.user._id.toString()) {
            return res.status(403).json({ message: "Forbidden: Access denied" });
        }

        if (req.user.role === "ADMIN" && req.params.id === req.user._id.toString()) {
            return res.status(400).json({ message: "Administrators cannot delete their own accounts." });
        }

        const user = await Users.findById(user_id);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        await Players.deleteOne({ user_id: user_id });
        await Users.deleteOne({ _id: user_id });

        const isSelf = user_id.toString() === req.user._id.toString();
        if (isSelf && req.user.role !== "ADMIN") {
            res.clearCookie("token", {
                httpOnly: true,
                sameSite: "Strict",
                secure: process.env.NODE_ENV === "production",
            });
        }

        res.status(200).json({ message: "Profile and related data deleted successfully." });

    } catch (error) {
        res.status(500).json({ message: "An error occurred while deleting the profile.", error: error.message });
    }
};


exports.deleteData = async (req, res) => {
    try {
        const { type, id } = req.params;

        if(type === "users")
            return res.status(400).json({ message: "Use another route for this operation" });

        if (!collections[type]) {
            return res.status(400).json({ message: "Invalid collection name" });
        }

        const document = await collections[type].findByIdAndDelete(id);

        if (!document) {
            return res.status(404).json({ message: "Document not found" });
        }

        return res.status(200).json({ message: "Document deleted" });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
}
