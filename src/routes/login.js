const express= require("express");
const loginRouter = express.Router();
const User = require("../models/user"); // Importing the User model
const cookieParser = require("cookie-parser"); // Importing cookie-parser to handle cookies

loginRouter.use(cookieParser()); // Using cookie-parser middleware

loginRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    if (!emailId || !password) {
      return res
        .status(400)
        .json({ message: "Email ID and password are required" });
    }
    const userData = await User.findOne({ emailId });
    if (!userData) {
      return res.status(404).json({ message: "Invalid login credentials" });
    }
    const isPasswordValid = await userData.validatePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid login credentials" });
    } else {
      const token = userData.getJWT();
      res.cookie("token", token, {expires: new Date(Date.now() + 24 * 60 * 60 * 1000)});
      res.send("Login successful, cookie set");
    }
  } catch (err) {
    console.log("invalid login credentials", err);
    res.status(401).json({ message: "Invalid login credentials" });
  }
});

loginRouter.get("/logout" , (req,res) =>{
  // res.clearCookie("token");
  // res.send("Logout successful, cookie cleared");

  //or
   
  res.cookie("token", null, {expires: new Date(0)});
  res.send("User logged out, cookie cleared");
})

module.exports = loginRouter;