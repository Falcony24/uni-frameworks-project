const mongoose = require('mongoose');

const UpgradesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    effect: {
        type: String,
        enum: ['click_multiplier', 'auto_click', 'crit_chance'],
        required: true
    },
    base_value: {
        type: Number,
        required: true
    },
    base_cost: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Upgrades', UpgradesSchema);
