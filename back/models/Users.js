const mongoose = require('mongoose')
const {hash} = require("bcrypt");
require('dotenv').config()

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
    role: {
        type: String,
        enum: ['USER', 'ADMIN', 'SHOP_ADMIN', 'GAME_ADMIN'],
        default: 'USER'
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});

UsersSchema.pre("save", async function () {
    this.password = await hash(this.password, 12);
});

module.exports = mongoose.model('users', UsersSchema);
