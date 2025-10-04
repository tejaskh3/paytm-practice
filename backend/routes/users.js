const {singUp, login, updateUser, logout} = require("../controllers/users")
const router = require("express").Router()
const {authMiddleware} = require("../middlewares/authMiddleware")
router.post("/singup", singUp)
router.post("/login", login)
router.get("/logout", authMiddleware, logout)
router.patch("users/update", authMiddleware, updateUser)

module.exports = {usersRouter: router}