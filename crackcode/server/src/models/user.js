const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    totalXP: { type: Number, default: 0 },
    level: { type: Number, default: 0 },
    batch: { type: String, default: "Bronze" },
    lastActive: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);