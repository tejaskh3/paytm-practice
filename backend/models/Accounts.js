const {mongoose} = require("mongoose")

const account = new mongoose.Schema({
    balance: {
        type: Number,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: true })

const Account = mongoose.model("Account", account);
module.exports = { Account }
