const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/user'); // Adjust path to your User model

dotenv.config();


const seedData = [
    { username: "CodeNinja", totalXP: 1500, level: 10 },
    { username: "BitMaster", totalXP: 2400, level: 15 },
    { username: "DebugQueen", totalXP: 3, level: 20 },
    { username: "ScriptWizard", totalXP: 1100, level: 8 },
    { username: "LogicKing", totalXP: 2800, level: 18 },
    { username: "SyntaxError", totalXP: 500, level: 3 },
    { username: "JavaJedi", totalXP: 1950, level: 12 },
    { username: "PythonPro", totalXP: 2100, level: 14 },
    { username: "ReactRacer", totalXP: 3500, level: 22 },
    { username: "Hackzilla", totalXP: 900, level: 6 }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Connected to MongoDB for seeding...");

        // Clear existing users to start fresh
        // await User.deleteMany({}); 

        await User.insertMany(seedData);
        console.log("🚀 10 Test Users added successfully!");
        
        process.exit();
    } catch (err) {
        console.error("❌ Error seeding data:", err);
        process.exit(1);
    }
};

seedDB();