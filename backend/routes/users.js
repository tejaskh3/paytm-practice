const {singUp, login, updateUser, logout, getAllUsers} = require("../controllers/users")
const {transferFunds} = require("../controllers/accounts")
const router = require("express").Router()
const {authMiddleware} = require("../middlewares/authMiddleware")
router.post("/singup", singUp)
router.post("/login", login)
router.get("/logout", authMiddleware, logout)
router.patch("users/update", authMiddleware, updateUser)
router.post("/accounts/funds/transfer", authMiddleware, transferFunds)
router.get("/users", authMiddleware, getAllUsers)

module.exports = {usersRouter: router}