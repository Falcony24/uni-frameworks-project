const mongoose = require('mongoose');

const PlayerItemsSchema = new mongoose.Schema({
    equipped: {
        type: Boolean,
        required: true,
        default: false
    },
    player_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Players',
        required: true
    },
    item_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Items',
        required: true
    }
});

module.exports = mongoose.model('PlayerItems', PlayerItemsSchema);
