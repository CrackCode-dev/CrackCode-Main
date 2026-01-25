import mongoose from "mongoose";

const connectDB = async ()=> {
    mongoose.connection.on('connected', ()=> console.log("Datebase connected."));
    await mongoose.connect(`${process.env.MONGODB_URI}/Mern-Authen`)
};

export default connectDB;