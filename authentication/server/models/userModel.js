import mongoose from "mongoose";

const userSchema = new mongoose.Schema({   // Define the schema for User
  name: {
    type: String, required: true
  },
  email: {  
    type: String, required: true, unique: true // Ensure email is unique
  },
  password: {
    type: String, required: true
  },
  verifyOtp:{
    type:String,default: ''
  },
  verifyOtpExpiryAt:{
    type:Number,default:0
  },
  isAccountVerified:{
    type:Boolean,default:false
  },
  resetOtp:{
    type:String,default:''
  },
    resetOtpExpiryAt:{  
    type:Number,default:0
  }
}, { timestamps: true });   

const UserModel = mongoose.models.user || mongoose.model('User', userSchema);// Create the User model

export default  UserModel;