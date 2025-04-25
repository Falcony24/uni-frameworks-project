const Users = require('../models/Users');
const Players = require('../models/Players');
const collections = { players: Players };
const {
    isAdmin,
    validateObjectId,
    findUserById,
    updateDocument,
    replaceOrUpsert,
    verifyPasswordChange
} = require('../util/modelUtil');

exports.getAllUsers = async (req, res) => {
    if (!isAdmin(req.user)) {
        return res.status(403).json({ message: "Forbidden: Admin access required" });
    }

    try {
        const users = await Users.find().select("-password").lean();
        const players = await Players.find({ user_id: { $in: users.map(u => u._id) } });

        const response = users.map(user => ({
            userId: user._id,
            user,
            player: players.find(p => p.user_id.toString() === user._id.toString()) || null,
        }));

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

exports.profile = async (req, res) => {
    const userId = req.params.id || req.user._id;

    if (req.params.id && !isAdmin(req.user) && req.params.id !== req.user._id.toString()) {
        return res.status(403).json({ message: "Access denied" });
    }

    try {
        const user = await findUserById(Users, userId, "username email role created_at customer");
        if (!user) return res.status(404).json({ message: "User not found" });

        const player = await Players.findOne({ user_id: userId });
        res.status(200).json({ userId: user._id, user, player, customer: user.customer || null });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

exports.getProfileData = async (req, res) => {
    const { type } = req.params;
    const userId = req.params.id || req.user._id;

    if (!validateObjectId(userId)) {
        return res.status(400).json({ message: "Invalid id" });
    }

    const modelMap = { users: Users, players: Players, customers: null };
    const Model = modelMap[type];

    if (!Model) return res.status(400).json({ message: "Invalid data type" });

    try {
        const query = type === "users" ? { _id: userId } : { user_id: userId };
        const data = await Model.findOne(query);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

exports.putData = async (req, res) => {
    const { type } = req.params;
    const userId = req.user._id;
    const Model = collections[type];

    if (!Model) return res.status(400).json({ error: "Invalid data type" });

    try {
        const updatedDoc = await replaceOrUpsert(Model, { user_id: userId }, { ...req.body, user_id: userId });
        res.json(updatedDoc);
    } catch (err) {
        res.status(500).json({ error: "Internal server error", err });
    }
};

exports.changeUserData = async (req, res) => {
    const { type } = req.params;
    const userId = req.params.id || req.user._id;
    const isSelf = !req.params.id || req.params.id === req.user._id.toString();

    if (!validateObjectId(userId) || (req.params.id && !isAdmin(req.user) && !isSelf)) {
        return res.status(403).json({ message: "Forbidden" });
    }

    try {
        let updated;

        if (type === "users") {
            const data = { ...req.body };

            if (!isAdmin(req.user)) {
                const allowed = ["username", "password", "newPassword"];
                if (!Object.keys(data).every(key => allowed.includes(key))) {
                    return res.status(403).json({ message: "Not allowed to change those fields" });
                }
            }

            if (data.password) {
                const newHashed = await verifyPasswordChange(userId, Users, data.password, data.newPassword);
                if (!newHashed) return res.status(400).json({ message: "Invalid old password" });
                data.password = newHashed;
                delete data.newPassword;
            }

            updated = await updateDocument(Users, { _id: userId }, data);
        } else if (type === "players") {
            updated = await updateDocument(Players, { user_id: userId }, req.body);
        } else {
            return res.status(400).json({ message: "Unknown update type" });
        }

        if (!updated) return res.status(404).json({ message: "Document not found" });

        res.status(200).json({ message: "Update successful", data: updated });
    } catch (error) {
        res.status(500).json({ message: "Update failed", error: error.message });
    }
};

exports.deleteProfile = async (req, res) => {
    const userId = req.params.id || req.user._id;

    if (req.params.id && !isAdmin(req.user) && req.params.id !== req.user._id.toString()) {
        return res.status(403).json({ message: "Forbidden" });
    }

    if (isAdmin(req.user) && req.params.id === req.user._id.toString()) {
        return res.status(400).json({ message: "Admins cannot delete their own accounts" });
    }

    try {
        const user = await Users.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        await Players.deleteOne({ user_id: userId });
        await Users.deleteOne({ _id: userId });

        if (userId.toString() === req.user._id.toString() && !isAdmin(req.user)) {
            res.clearCookie("token", {
                httpOnly: true,
                sameSite: "Strict",
                secure: process.env.NODE_ENV === "production",
            });
        }

        res.status(200).json({ message: "Profile and related data deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: "Deletion failed", error: error.message });
    }
};

exports.deleteData = async (req, res) => {
    const { type, id } = req.params;
    const Model = collections[type];

    if (type === "users") return res.status(400).json({ message: "Use another route for this operation" });
    if (!Model || !validateObjectId(id)) return res.status(400).json({ message: "Invalid collection or id" });

    try {
        const deleted = await Model.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ message: "Document not found" });
        res.status(200).json({ message: "Document deleted" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};
