const {transferFunds, showAccountDetails } = require("../controllers/accounts")
const {authMiddleware} = require("../middlewares/authMiddleware")
const router = require("express").Router()
console.log(
    "this is auth middleware"
, authMiddleware)
router.post("/accounts/funds/transfer", authMiddleware, transferFunds)
router.get("/accounts/balance", authMiddleware, showAccountDetails)

module.exports = {accountsRouter: router}