const mongoose = require("mongoose");

const user = new mongoose.Schema({
    firstName:{
        type: String, 
        required: true
    },
    lastName:{
        type: String, 
    },
    email:{
        type: String, 
        unique: true,      
        required: true 
    },
    password:{
        type: String, 
        required: true
    }
    
}, { timestamps: true })

const User = mongoose.model("User", user);
module.exports = { User }