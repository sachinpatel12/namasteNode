const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema({

    senderId:{
        type : mongoose.Schema.Types.ObjectId,
        ref : "User", //this is a refrence to users table and you can populate the details while getting the data 
        required: true
    },
    receiverId:{
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required: true
    },
    status:{
        type: String,
        enum: 
        {
            values: ['Ignored', 'Interested','Accepted', 'Rejected'],
            message: 'Status must be either Ignored, Accepted, or Rejected'
        },
        required: true,
    }
},
{
    timestamps:true
})

connectionRequestSchema.index({receiverId : 1,senderId : 1});

const ConnectionRequest = mongoose.model('ConnectionRequest', connectionRequestSchema);
module.exports = ConnectionRequest;