const express = require("express"); // this will load the express module from node_modules folder
const connectDB = require("./config/database"); // this will load the database configuration file
const app = express(); // this will create an instance of xpress
const User = require("./models/user"); // this will load the User model


app.post("/signup", async (req, res)=>{
    try{
        const userData = {
            firstName: "John",
            lastName: "Doe",
            emailId: "john.doe@example.com",
            password: "password123",
            age: 30,
            gender: "Male"
        }

        // Here you would typically validate the userData and check for existing users
        // For now, we will just create a new user instance
        const user = new User(userData); // Create a new user instance with the provided data
        await user.save(); // Save the user to the database
        res.status(201).json({ message: "User registered successfully", user });
    }catch(err){
        console.error("Error during signup:", err);
        res.status(500).json({ message: "Internal server error" });
    }
})





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
