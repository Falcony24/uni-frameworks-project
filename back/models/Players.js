const mongoose = require('mongoose');

const PlayersSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        unique: true
    },
    currency: {
        type: Number,
        default: 0
    },
    ban_status: {
        type: Boolean,
        default: false
    },
    clicks: {
        type: Number,
        default: 0
    },

    items: [{
        item_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Item",
            required: true
        },
        equipped: {
            type: Boolean,
            default: false
        }
    }],

    upgrades: [{
        upgrade_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "upgrade",
            required: true
        },
        lvl: {
            type: Number,
            default: 1
        }
    }]
});

module.exports = mongoose.model('players', PlayersSchema);
