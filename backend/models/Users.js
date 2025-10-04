const mongoose = require("mongoose");

const user = new mongoose.Schema({
    firstName:{
        type: string, 
        required: true
    },
    lastName:{
        type: string, 
    },
    email:{
        type: string, 
        uniqe: true
    },
    password:{
        type: string, 
        required: true
    }
    
}, { timestamps: true })

const Users = mongoose.model("Users", user);
module.exports = { Users }