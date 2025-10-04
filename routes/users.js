const {singUp, login, updateUser} = require("../controllers/users")
const router = require("express").Router()

router.post("/singup", singUp)
router.post("/login", login)
router.get("/logout", logout)
router.patch("users/update", updateUser)

module.exports = {usersRouter: router}