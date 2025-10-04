const {User } = require("../models/Users")
const {Account }    = require("../models/Accounts")
const bcrypt = require("bcrypt") // study : tradeoffs between bcrypt and bcryptjs


const singUp = async (req, res) => {
    try {
       const {firstName, lastName, email, password} = req.body
       if(!firstName){
        res.status(400).json({ error: "First name is required" }) // study: why not use send what are tradeoffs
       }
       if(!email){
        res.status(400).json({ error: "Email is required" })
       }
       if(!password){
        res.status(400).json({ error:   "Password is required"})
       }
       const existingUser = await User.findOne({email})
       if(existingUser){
        res.status(400).json({error: "Email already exists"})
       }

       // encrypt password
       const salt = await bcrypt.genSalt(10)
       const hashedPassword = await bcrypt.hash(password, salt) // study: this in deep why we need to use await high level i know
       
        const user = new User({ // study: the methods at least at high level and write a blog on that
            firstName,
            lastName,
            email,
            password: hashedPassword
        })
        const randomAmmount =  1 + Math.random() * 10000
        const account = new Account({
            balance: randomAmmount,
            user: user._id
        })
        await account.save()
        await user.save()
        res.cookie("access_token ", JSON.stringify({user: user._id, email: user.email}), {httpOnly: true, secure: true, sameSite: "lax", maxAge: 60 * 60 * 24 * 7}) // max age is: 7 days
        res.status(201).json({user, message: "User created successfully"})
    } catch (error) {
        console.log("Error while creating user", error)
        res.status(500).json({error: "Error while creating user, please try again later"})
    }
}

const login = async (req, res) => {
    try {
        const {email, password} = req.body
        if(!email || !password){
            res.status(400).json({ error: "Email or password is required" })
        }
        const user = await User.findOne({email})
        const isCorrectPassword = await bcrypt.compare(password, user.password)
        if(!isCorrectPassword || !user){
            res.status(400).json({ error: "Invalid email or password" }) // to make sure that the user is not a hacker trying to hit and trial to get the password
        }

        res.cookie("access_token ", JSON.stringify({user: user._id, email: user.email}), {httpOnly: true, secure: true, sameSite: "lax", maxAge: 60 * 60 * 24 * 7}) // 7 day
        res.status(200).json({user, message: "User logged in successfully"})

    } catch (error) {
        console.log("Error while login", error)
        res.status(500).json({ error: "Error while login, please try again later"}) // study: is sending error here is safe or we are exposing someting vulnerable
    }
}

const updateUser = async (req,  res)  => {
    try {
        const {_id} = req.user
        const {firstName, lastName, email, password} = req.body // study: can i use body directly else how will i identity if lastName is not provided and i still end up updating it although for now checking it in the data below
        if(!firstName || !lastName ||!email ||  !password){
            res.status(400).json({ error: "Atleast one field is required to update" })
        }

        // todo: create utility to update
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt) 

        const updatedFields = {
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(email && { email }),
        ...(password && { password: hashedPassword })
        };

        const user = await User.findOneAndUpdate({_id}, updatedFields, {new: true})
        res.cookie("access_token ", JSON.stringify({user: user._id, email: user.email}), {httpOnly: true, secure: true, sameSite: "lax", maxAge: 60 * 60 * 24 * 7})
        res.status(200).json({user, message: "User updated successfully"})
    } catch (error) {
        console.log("Error updating user", error)
        res.status(500).json({ error: "Error while updating user, please try again later"})
    }
}

const logout = async (req, res) => {
    try {
       res.clearCookie("access_token")
       res.status(200).json({message: "User logged out successfully"})
    } catch (error) {
        console.log("Error while logging out", error)
        res.status(500).json({ error: "Error while logging out, please try again later"})
    }
}
module.exports = {
    singUp,
    login,
    updateUser,
    logout
}


// study 
// HTTPonly ensures that a cookie is not accessible using the JavaScript code. This is the most crucial form of protection against cross-scripting attacks.
// A secure attribute ensures that the browser will reject cookies unless the connection happens over HTTPS.
// aren't they both contradictory
