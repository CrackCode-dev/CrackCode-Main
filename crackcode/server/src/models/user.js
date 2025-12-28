const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    xp: { type: Number, default: 0 },
    tokens: { type: Number, default: 100 },
    rank: { type: String, default: "Rookie" },
    lastActive: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);