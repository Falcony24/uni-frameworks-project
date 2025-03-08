const mongoose = require('mongoose');

const ItemRequirementsSchema = new mongoose.Schema({
    required_click: {
        type: Number,
        default: 0
    },
    required_upgrade_lvl: {
        type: Number,
        default: 0
    },
    item_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Items',
        required: true
    },
    upgrade_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Upgrades',
        required: true
    },
    player_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Players',
        required: true
    }
});

module.exports = mongoose.model('ItemRequirements', ItemRequirementsSchema);
