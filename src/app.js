const express = require("express"); 
const connectDB = require("./config/database");
const app = express(); 
const cookieParser = require("cookie-parser"); 

app.use(express.json()); 
app.use(cookieParser()); 

const userRoutes = require("./routes/user");
const loginRoutes = require("./routes/login");
const profileRoutes = require("./routes/profile");
const connectionRequestRouter = require("./routes/connectionrequest");

app.use("/", userRoutes);
app.use("/", loginRoutes);
app.use("/", profileRoutes);
app.use("/", connectionRequestRouter);

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
