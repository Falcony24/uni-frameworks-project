const Users = require("../models/Users");
const Upgrades = require("../models/Upgrades");
const Players = require("../models/Players");
const upgradesEnum = require("../shared/enums/UpgradesEnum");

exports.initializeDatabase = async () => {
    for(const upgrade of upgradesEnum) {
        let upgradeRes = await Upgrades.findOne({ effect: upgrade.effect })
        if (!upgradeRes) {
            upgradeRes = new Upgrades({
                name: upgrade.name,
                effect: upgrade.effect,
                base_value: upgrade.base_value,
                base_cost: upgrade.base_cost,
            });
            await upgradeRes.save()
        }
    }

    const existingAdmin = await Users.findOne({ role: 'ADMIN' });
    if (!existingAdmin) {
        const adminUser = new Users({
            username: 'admin',
            email: 'admin@example.com',
            password: "Admin1234?",
            role: 'ADMIN',
        });
        await adminUser.save();

        let upgrade = await Upgrades.findOne({ effect: "CLICK_POWER" })
        const newPlayer = new Players({
            user_id: adminUser._id,
            upgrades: [
                {
                    upgrade_id: upgrade._id,
                    level: 1,
                }
            ]
        });

        await newPlayer.save();
    }
}