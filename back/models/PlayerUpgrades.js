const mongoose = require('mongoose');

const PlayerUpgradesSchema = new mongoose.Schema({
    lvl: {
        type: Number,
        required: true,
        default: 1
    },
    player_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Players',
        required: true
    },
    upgrade_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Upgrades',
        required: true
    }
});

module.exports = mongoose.model('PlayerUpgrades', PlayerUpgradesSchema);
