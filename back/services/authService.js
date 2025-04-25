const Users = require("../models/Users");
const Players = require("../models/Players");
const Upgrades = require("../models/Upgrades");
const { usersSchema } = require("../shared/schemas/usersSchema");
const {
    checkUserExistence,
    checkPassword,
    setTokenCookie,
} = require("../util/authUtil");

const signUp = async (req, res) => {
    const result = usersSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ message: "Invalid data" });
    }

    const { username, email, password } = result.data;

    if (await checkUserExistence(email, username)) {
        return res.status(400).json({ message: "Email or username already in use" });
    }

    const newUser = new Users({ username, email, password });

    const defaultUpgrade = await Upgrades.findOne({ effect: "CLICK_POWER" });
    const newPlayer = new Players({
        user_id: newUser._id,
        upgrades: [{
            upgrade_id: defaultUpgrade.id,
            level: 1,
        }],
    });

    await newUser.save();
    await newPlayer.save();

    await setTokenCookie(res, newUser);
    return res.status(201).json({ message: "Account created successfully" });
};

const signIn = async (req, res) => {
    const { username, password } = req.body;

    const user = await Users.findOne({
        $or: [{ email: username }, { username }],
    });

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    const passwordValid = await checkPassword(password, user.password);
    if (!passwordValid) {
        return res.status(400).json({ message: "Incorrect credentials" });
    }

    await setTokenCookie(res, user);
    return res.status(200).json({ message: "Logged successfully" });
};

module.exports = {
    signUp,
    signIn,
};
