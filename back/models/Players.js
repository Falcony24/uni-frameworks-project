const mongoose = require('mongoose');

const PlayersSchema = new mongoose.Schema({
    currency: {
        type: Number,
        required: true,
        default: 0
    },
    ban_status: {
        type: Boolean,
        required: true,
        default: false
    },
    clicks: {
        type: Number,
        required: true,
        default: 0
    }
});

module.exports = mongoose.model('Players', PlayersSchema);
