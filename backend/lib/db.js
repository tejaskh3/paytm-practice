
const Mongoose = require("mongoose")

const connectDB = async (url) => {
  await Mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  console.log("MongoDB Connected successfully")
}

module.exports = { connectDB }
