const Upgrades = require('../models/Upgrades')
const Players = require('../models/Players')

exports.getUpgrades = async (req, res) => {
    try {
        const upgrades = await Upgrades.find();
        res.status(200).json(upgrades);
    } catch (error) {
        res.status(500).json({ message: "Failed to get upgrades", error: error.message });
    }
};

exports.createUpgrade = async (req, res) => {
    try {
        const { name, effect, base_value, base_cost } = req.body;

        const upgrade = new Upgrades({
            name,
            effect,
            base_value,
            base_cost
        });

        await upgrade.save();

        res.status(201).json({ message: "Upgrade created successfully", upgrade });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: "Upgrade with this name already exists." });
        }

        res.status(400).json({ message: "Failed to create upgrade", error: error.message });
    }
};


exports.replaceUpgrade = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        const replaced = await Upgrades.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
            overwrite: true
        });

        if (!replaced) {
            return res.status(404).json({ message: "Upgrade not found" });
        }

        res.status(200).json(replaced);
    } catch (error) {
        res.status(400).json({ message: "Failed to replace upgrade", error: error.message });
    }
};

exports.updateUpgrade = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        const updated = await Upgrades.findByIdAndUpdate(id, { $set: data }, {
            new: true,
            runValidators: true
        });

        if (!updated) {
            return res.status(404).json({ message: "Upgrade not found" });
        }

        res.status(200).json(updated);
    } catch (error) {
        res.status(400).json({ message: "Failed to update upgrade", error: error.message });
    }
};

exports.buyUpgrade = async (req, res) => {
    const userId = req.user._id;
    const upgradeId = req.params.upgradeId;

    try {
        const player = await Players.findOne({ user_id: userId });
        if (!player) return res.status(404).json({ message: "Player not found" });

        const upgrade = await Upgrades.findById(upgradeId);
        if (!upgrade) return res.status(404).json({ message: "Upgrade not found" });

        const playerUpgrade = player.upgrades.find(u => u.upgrade_id.equals(upgrade._id));

        let nextLvl = 1;
        let cost = upgrade.base_cost;

        if (playerUpgrade) {
            nextLvl = playerUpgrade.lvl + 1;
            cost = upgrade.base_cost * nextLvl;
        }

        if (player.currency < cost)
            return res.status(400).json({ message: "Not enough currency" });

        player.currency -= cost;

        if (playerUpgrade) {
            playerUpgrade.lvl = nextLvl;
        } else {
            player.upgrades.push({ upgrade_id: upgrade._id, lvl: 1 });
        }

        await player.save();

        res.status(200).json({
            message: playerUpgrade ? "Upgrade leveled up" : "Upgrade purchased",
            upgrade: player.upgrades.find(u => u.upgrade_id.equals(upgrade._id)),
            currency: player.currency
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating upgrade", error: error.message });
    }
};

exports.deleteUpgrade = async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await Upgrades.findByIdAndDelete(id);

        if (!deleted) {
            return res.status(404).json({ message: "Upgrade not found" });
        }

        res.status(200).json({ message: "Upgrade deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete upgrade", error: error.message });
    }
};
