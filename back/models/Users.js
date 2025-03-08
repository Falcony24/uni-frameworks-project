const mongoose = require('mongoose');

const UsersSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: [true, 'Username exists']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: [true, 'Email exists']
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    role: {
        type: String,
        enum: ['USER', 'ADMIN'],
        required: true,
        default: 'USER'
    },
    player_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Players',
        required: true
    }
});

module.exports = mongoose.model('Users', UsersSchema);
