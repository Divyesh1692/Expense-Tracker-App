require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");

const auth = async (req, res, next) => {
  console.log("in auth");

  try {
    let token = req.cookies.token;
    console.log("Token: " + token);

    if (!token)
      return res
        .status(401)
        .json({ success: false, message: "No token, authorization denied" });

    let decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded: " + decoded);

    if (!decoded)
      return res
        .status(401)
        .json({ message: "Invalid token, authorization denied" });
    req.user = await User.findById(decoded.userId).select("-password");
    console.log(req.user);

    next();
  } catch (error) {
    res
      .status(500)
      .json({ message: "error validating token", error: error.message });
  }
};

module.exports = auth;