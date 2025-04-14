const Users = require("../models/Users");
const Upgrades = require("../models/Upgrades");
const Players = require("../models/Players");

exports.initializeDatabase = async () => {
    let upgrade = await Upgrades.findOne({ effect: 'CLICK_MULTIPLIER' });
    if (!upgrade) {
        upgrade = new Upgrades({
            name: 'Double click power',
            effect: 'CLICK_MULTIPLIER',
            base_value: 1,
            base_cost: 10,
        });
        await upgrade.save();
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