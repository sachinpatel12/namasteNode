const express= require("express");
const userRouter = express.Router();
const User = require("../models/user");
const cookieParser = require("cookie-parser"); 
const { isValidBody } = require("../utils/validation"); 
const jwt = require("jsonwebtoken"); 
const { validateCookie } = require("../middlewares/cookieValidation");
const bcrypt = require("bcrypt");
const ConnectionRequestSchema = require("../models/connectionRequest");
const { set } = require("mongoose");
userRouter.use(cookieParser());

const USER_SAFE_DATA = "firstName lastName age skills";

userRouter.post("/signup", async (req, res) => {
  try {
    isValidBody(req);
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const userData = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      emailId: req.body.emailId,
      password: hashedPassword,
      age: req.body.age,
      gender: req.body.gender,
      photoUrl: "https://picsum.dev/image/1191/size", 
      skills: req.body.skills || [],
    };
    const user = new User(userData); 
    await user.save(); 
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
userRouter.get("/feed", async (req, res) => {
  console.log("Fetching feed..."); 
  try {
    const userEmailId = req.body.emailId;
    console.log("User Email ID:", userEmailId); 
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
userRouter.put("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;

  try {
    const allowedFields = [
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
      returnDocument: "after",
      runValidators: true,
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


userRouter.get("/profile",validateCookie, async (req, res) => {

  const userProfile = req.user; // Access the user details from the request object
  if (!userProfile) {
    return res.status(404).json({ message: "User not found" });
  }
  res.send(userProfile);
});

userRouter.get('/user/request/received',validateCookie ,async(req,res)=>{
  const userId = req.user._id;
  const connectionReuestList = await ConnectionRequestSchema.find({
    receiverId : userId,
    status:'Interested'
  }).populate("senderId", ["firstName","lastName","age","skills"]) //we are able to populate because we created a ref of user in snederId with user.
  res.status(200).send({data : connectionReuestList})
})

userRouter.get('/user/reqest/friends',validateCookie,async (req,res)=>{
   const userId = req.user._id;
    const acceptedRequestList = await ConnectionRequestSchema.find({
      $or:[{
        receiverId : userId,
        status : 'Accepted'
      }, 
      {
        senderId : userId,
        status : 'Accepted'
       
      }]
      
    }).populate("senderId",["firstName","lastName"]).populate('receiverId',["firstName","lastName"])

  if(!acceptedRequestList){
    res.status(400).send({Error : "some error while getting the friend list"})
  }

  const validFriends = acceptedRequestList.map((elem)=>{
     if(elem.senderId._id.toString() === userId.toString()){
      return elem.receiverId;
     }
     return elem.senderId;
  })


  res.status(200).send({friendsList : validFriends})
})

userRouter.get("/user/feed",validateCookie,async (req,res)=>{
  const logedInUserId = req.user._id;
  const page = parseInt(req.query.page) || 1;
  let limit = parseInt(req.query.limit) || 10;
  limit = limit > 50 ? 50 : limit; //restricting user to not put more than 50 to reduce db load
  const skip = (page -1) * limit;
  
  // Page 1 → skip = (1 - 1) * 10 = 0
  // Page 2 → skip = (2 - 1) * 10 = 10
  // Page 3 → skip = (3 - 1) * 10 = 20


  const connectionList = await ConnectionRequestSchema.find({
    $or:[
      {
        senderId : logedInUserId
      },
      {
        receiverId : logedInUserId
      }
    ]
  }).select("senderId receiverId");

  if(!connectionList){
    res.status(400).send("some error while getting the details.")
  }

  const hideUsersFromFeed = new Set();

  if(connectionList.length){
      connectionList.forEach((elem) =>{
        hideUsersFromFeed.add(elem.senderId.toString());
        hideUsersFromFeed.add(elem.receiverId.toString());
      })
  }
  const userFeedList = await User.find({
    $and:[
      {_id : {$nin : Array.from(hideUsersFromFeed)}},
      {_id :{$ne: logedInUserId}}
    ]
  }).select(USER_SAFE_DATA).skip(skip).limit(limit);

  if(!userFeedList){
    res.status(400).send("there is some error while getting the detils of users feed")
  }
  res.send(userFeedList)
})
module.exports = userRouter;