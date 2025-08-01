const express = require("express");
const connectionRequestRouter = express.Router();
const ConnectionRequestSchema = require("../models/connectionRequest");
const { validateCookie } = require("../middlewares/cookieValidation");
const mongoose = require("mongoose");
const User = require("../models/user");

connectionRequestRouter.post(
  "/request/send/:status/:receiverId",
  validateCookie,
  async (req, res) => {
    const { status, receiverId } = req.params;
    const senderId = req.user._id; // Get senderId from the authenticated user
    const allowedStatuses = ["Ignored", "Interested"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        error: "Invalid status. Allowed statuses are Ignored or Interested.",
      });
    }
    try {
      //check if the receiverId is valid
      if (!receiverId || !mongoose.Types.ObjectId.isValid(receiverId)) {
        return res.status(400).json({ error: "Invalid receiver ID." });
      }
      if (senderId === receiverId) {
        return res
          .status(400)
          .json({ error: "You cannot send a connection request to yourself." });
      }
      // Check if the receiver exists
      const receiverExists = await User.findById({ _id: receiverId });
      if (!receiverExists) {
        return res.status(404).json({ error: "Receiver not found." });
      }

      // Check if a connection request already exists from both the side
      const ifRequetExists = await ConnectionRequestSchema.findOne({
        $or: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      });
      if (ifRequetExists) {
        res.status(400).send({
          error: "Connection request already exists between these users.",
        });
        return;
      }
      const connectionRequest = new ConnectionRequestSchema({
        senderId,
        receiverId,
        status,
      });
      await connectionRequest.save();
      res.status(201).json({ message: "Connection request sent successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message || "Internal server error" });
    }
  }
);

//accepting or ignorng the request senderID is who sent the request to loggedin user
connectionRequestRouter.post(
  "/request/review/:status/:connectionId",
  validateCookie,
  async (req, res) => {
    const { status, connectionId } = req.params;
    const loggedInUser = req.user;
    if (
      !connectionId ||
      !mongoose.Types.ObjectId.isValid(connectionId) ||
      !loggedInUser._id ||
      !mongoose.Types.ObjectId.isValid(loggedInUser._id)
    ) {
     return res
        .status(400)
        .send({ error: "Receiver or sender Id is not valid." });
    }

    const validateStatus = ["Accepted", "Rejected"];
    if (!validateStatus.includes(status)) {
      return res.status(400).send("Invalid status!");
    }

    const isValidRequest = await ConnectionRequestSchema.findOne({
      _id: connectionId,
      receiverId: loggedInUser._id,
      status: "Interested",
    });

    if (!isValidRequest) {
     return res.status(400).send("This is not a valid request to accept.");
    }

    const updateRequestDetails = await  ConnectionRequestSchema.findOneAndUpdate(
      {
        _id: connectionId,
        receiverId: loggedInUser._id,
        status: "Interested"
      },
      {
        $set: {
          status: status,
        },
      },
      { new: true }
    );

    if (!updateRequestDetails) {
      return res.status(400).send("There is some error while updating the detail.");
    }

    return res.status(200).send("Connection request accepted successfully.");
  }
);
module.exports = connectionRequestRouter;
