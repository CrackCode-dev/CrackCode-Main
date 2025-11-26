import mongoose from "mongoose";

const connectDB = async () => {
  try {

    mongoose.connection.on('connected', () => {
      console.log("Mongodb connected successfully");
    });

    await mongoose.connect(`${process.env.MONGODB_URL}/mern-auth`)
    }
  catch (error) {
    console.log("Mongodb connection failed", error);
  }
}    
export { connectDB };