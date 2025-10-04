const { Account } = require("../models/Accounts");
const {mongoose } = require("mongoose")


const transferFunds = async (req, res) => {
    const {fromAccount, toAccount, amount} = req.body
    if(!fromAccount){
        res.status(400).json({ error: "From account is required" })
    }
    if(!toAccount){
        res.status(400).json({ error: "To account is required" })
    }
    if(!amount){
        res.status(400).json({ error: "Amount is required" })
    }
    const session = await mongoose.startSession();
    try {
        session.startTransaction();

        const senderAccount = await Account.findById(fromAccount)
        if(!senderAccount){
            return res.status(400).json({ error: "Sender account not found" })
        }

        const receiverAccount = await Account.findById(toAccount)
        if(!receiverAccount){
            return res.status(400).json({ error: "Receiver account not found" })
        }

        if(senderAccount.balance < amount){
            return res.status(400).json({ error: "Insufficient funds" })
        }

        senderAccount.balance -= amount
        receiverAccount.balance += amount

        await senderAccount.save({session})
        await receiverAccount.save({session})

        await session.commitTransaction();
        session.endSession();
    } catch (error) {
        console.log("Error while transfering funds", error)
        res.status(500).json({ error: "Error while transfering funds, please try again later"})
        session.abortTransaction();
    }finally{
       session.endSession();
    }
}

const showAccountDetails = async () => {
    const userId = req.user._id
    try {
        const account = await Account.findOne({userId})
        if(!account){
            return res.status(400).json({ error: "Account not found" })
        }
        res.status(200).json({account})
    } catch (error) {
        console.log("Error while showing account details", error)
        res.status(500).json({ error: "Error while showing account details, please try again later"})
    }
}
module.exports = {transferFunds, showAccountDetails}