const express = require("express"); // this will load the express module from node_modules folder
const connectDB = require("./config/database"); // this will load the database configuration file
const app = express(); // this will create an instance of xpress
const User = require("./models/user"); // this will load the User model
const { isValidBody } = require("./utils/validation"); // Importing validation utility

app.use(express.json()); // this will parse the incoming JSON requests if we don't use this, we will not be able to parse the JSON requests and we cannot access req.body

//resgister user
app.post("/signup", async (req, res) => {
  try {
    isValidBody(req); // Validate the request body using the utility function
    
    const userData = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      emailId: req.body.emailId,
      password: req.body.password,
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
    res.status(500).json({error: "Internal server error during signup", details: err.message });
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
