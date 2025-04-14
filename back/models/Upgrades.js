const mongoose = require('mongoose');

const upgradeSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    effect: {
        type: String,
        enum: ['CLICK_MULTIPLIER', 'AUTO_CLICK', 'CRIT_CHANCE'],
        required: true
    },
    base_value: { type: Number, required: true, min: 1 },
    base_cost: { type: Number, required: true, min: 1 }
});

module.exports = mongoose.model('Upgrade', upgradeSchema);
