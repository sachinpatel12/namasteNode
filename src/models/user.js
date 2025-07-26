const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName:{
        type: String,
        // required: true
    },
    lastName:{
        type: String,
        // required: true
    },
    emailId:{
        type: String,
        // required: true
    },
    password:{
        type: String,
        // required: true
    },
    age:{
        type: Number,
        // required: true
    },
    gender:{
        type: String,
        enum: ['Male', 'Female', 'Other'],
        // required: true
    }
})

module.exports = mongoose.model('User', userSchema); // Export the User model so it can be used in other files
