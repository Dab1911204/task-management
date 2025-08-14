const mongoose = require("mongoose")


const forgotPasswordSchema = new mongoose.Schema({
    email:String,
    otp:String,
    expireAt:{
        type: Date,
        expires:180 //lấy thời gian đc chuyền sang và cộng với expires(180s)
    }
},
{ timestamps: true }
)
const ForgotPassword = mongoose.model("ForgotPassword", forgotPasswordSchema, "forgot-password");

module.exports = ForgotPassword