const { Users } = require("../models/Users");

const authMiddleware = async (req, res, next) => {
  try {
    const cookies = req.cookies;
    const accessToken = cookies.access_token;

    if (!accessToken) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const { user: userId } = JSON.parse(accessToken);

    const user = await Users.findById(userId).select("-password"); // exclude password from response

    if (!user) {
      return res.status(401).json({ error: "Not authorized" });
    }
    req.user = user;

    next();
  } catch (error) {
    console.log("Error while authenticating user", error);
    res
      .status(500)
      .json({ error: "Error while authenticating user, please try again later" });
  }
};

module.exports = {authMiddleware};
