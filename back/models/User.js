const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: [true, 'Email exist']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    }
});

module.exports = mongoose.model.Users || mongoose.model('Users', UserSchema);
