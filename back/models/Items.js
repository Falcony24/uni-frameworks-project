const mongoose = require('mongoose');

const ItemsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Item name is required'],
        unique: [true, 'Item name exists']
    },
    description: {
        type: String,
        required: true
    },
    player_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Players',
        required: true
    }
});

module.exports = mongoose.model('Items', ItemsSchema);
