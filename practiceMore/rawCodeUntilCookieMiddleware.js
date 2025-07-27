const express = require("express"); // this will load the express module from node_modules folder
const connectDB = require("./config/database"); // this will load the database configuration file
const config = require("./config/config.json"); // this will load the configuration file
const app = express(); // this will create an instance of xpress
const User = require("./models/user"); // this will load the User model
const { isValidBody } = require("./utils/validation"); // Importing validation utility
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser"); // Importing cookie-parser to handle cookies
const jwt = require("jsonwebtoken"); // Importing jsonwebtoken for token handling

app.use(express.json()); // this will parse the incoming JSON requests if we don't use this, we will not be able to parse the JSON requests and we cannot access req.body

app.use(cookieParser()); // this will parse the cookies from the incoming requests

//resgister user
app.post("/signup", async (req, res) => {
  try {
    isValidBody(req); // Validate the request body using the utility function

    const hashedPassword = await bcrypt.hash(req.body.password, 10); // Hash the password with bcrypt
    const userData = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      emailId: req.body.emailId,
      password: hashedPassword,
      age: req.body.age,
      gender: req.body.gender,
      photoUrl: req.body.photoUrl || "https://picsum.dev/image/1191/size", // Default photo URL if not provided
      skills: req.body.skills || [], // Default to an empty array if no skills are provided
    };

    // Here you would typically validate the userData and check for existing users
    // For now, we will just create a new user instance
    const user = new User(userData); // Create a new user instance with the provided data
    await user.save(); // Save the user to the database
    res.status(201).json({ message: "User registered successfully", user });
  } catch (err) {
    console.error("Error during signup:", err);
    res
      .status(500)
      .json({
        error: "Internal server error during signup",
        details: err.message,
      });
  }
});

//get user feed
app.get("/feed", async (req, res) => {
  console.log("Fetching feed..."); // Log the request to fetch feed
  try {
    const userEmailId = req.body.emailId;
    console.log("User Email ID:", userEmailId); // Log the email ID being searched
    if (userEmailId) {
      const userDetails = await User.find({ emailId: userEmailId });
      console.log(userDetails);
      if (userDetails.length === 0) {
        return res.status(404).json({ message: "User not found" });
      } else {
        return res.send(userDetails);
      }
    }
  } catch (err) {
    console.error("Error fetching feed:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

//update user
app.put("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;

  try {
    const allowedFields = [
      // "userId", // This should not be updated, but included for completeness but I am commenting it out and adding in the query params
      "firstName",
      "lastName",
      "age",
      "gender",
      "skills",
    ];
    const isUpdateAllowed = Object.keys(data).every((key) =>
      allowedFields.includes(key)
    );
    if (!isUpdateAllowed) {
      return res
        .status(400)
        .json({ message: "Invalid fields in update request" });
    }
    const updateUser = await User.findByIdAndUpdate({ _id: userId }, data, {
      returnDocument: "after", // Return the updated document
      runValidators: true, // Run validation on the updated data We have creared the validation in user.js model gender field
    });
    console.log("User updated successfully:", updateUser);
    res
      .status(200)
      .json({ message: "User updated successfully", user: updateUser });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ "UPDATE FAILED": err.message });
  }
});

app.post("/login", async (req, res) => {
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
    const isPaswordValid = await bcrypt.compare(password, userData.password);
    if (!isPaswordValid) {
      return res.status(401).json({ message: "Invalid login credentials" });
    } else {
      // If login is successful, now to prevent user to login evertime to call other api's we have to send the cookie in response so once the user is logged in, we can use the cookie to authenticate the user for subsequent requests for this there is a express res.cookie method which we can use to set the cookie in the response

      const token = jwt.sign({ _id: userData._id }, config.tokenSecret); // Create a JWT token with the user's ID
      res.cookie("token", token);
      res.send("Login successful, cookie set");
    }
  } catch (err) {
    console.log("invalid login credentials", err);
    res.status(401).json({ message: "Invalid login credentials" });
  }
});

//profile api with cookie authentication
app.get("/profile", async (req, res) => {
  //you can use the cookie-parser middleware to parse cookies from the request so without using cookie parser we can't access the cookies from the request object directly just like we need express.json() to parse the JSON body of the request
  //so we need to install cookie-parser and use it as middleware in our app

  const cookies = req.cookies; // Get the token from cookies
  console.log("Cookies:", cookies); // Log the cookies for debugging
  if (!cookies.token) {
    return res.status(401).json({ message: "Unauthorized access, no token provided" });
  } else {
    // decode the token to get the user ID
    let userId;
    try {
      const decodedToken = await jwt.verify(cookies.token, config.tokenSecret); // Verify the token using the secret key
      userId = decodedToken._id;
      console.log("Decoded User ID:", userId);
      if (!userId) {
        res.status(401).json({ message: "Unauthorized access, invalid token" });
      } else {
        console.log("else")
        const userProfile = await User.findById(userId); 
        console.log("User Profile:", userProfile); // Log the user profile for debugging
        if(!userProfile) {
          return res.status(404).json({ message: "User not found" });
        }
        res.send(userProfile);
      }
    } catch (err) {
      console.error("Error decoding token:", err);
      return res
        .status(401)
        .json({ message: "Unauthorized access, invalid token" + err.message });
    }
    res
      .status(200)
      .json({ message: "Profile fetched successfully and cookie is valid" });
  }
});

connectDB().then((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
  } else {
    console.log("Connected to the database successfully");
    //we need to set the listener for the server on port 3000
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  }
});
