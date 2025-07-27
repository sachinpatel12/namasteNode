const mongoose = require('mongoose');
const validator = require('validator'); // Importing validator for input validation
const jwt = require('jsonwebtoken'); // Importing jsonwebtoken for creating JWT tokens
const config = require('../config/config.json'); // Importing configuration for token secret
const bcrypt = require('bcrypt'); // Importing bcrypt for password hashing

const userSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: true,
        trim: true,
        Minlength: 2, // Minimum length for first name
        Maxlength: 50 // Maximum length for first name
    },
    lastName:{
        type: String,
        required: true,
        trim: true // Trim whitespace from the last name
    },
    emailId:{
        type: String,
        required: true,
        unique: true, // Ensure emailId is unique
        trim: true, // Trim whitespace from the emailId
        validate(value){
            // Validate email format using validator library
            if(!validator.isEmail(value)){
                throw new Error('Invalid email format');
            }
        }
    },
    password:{
        type: String,
        required: true,
        trim: true, // Trim whitespace from the password
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error('Password must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, one number, and one symbol.');
            }
        }
    },
    age:{
        type: Number,
        required: true,
        min: 12,
        max: 120
    },
    gender:{
        type: String,
        // enum: ['Male', 'Female', 'Other'],
        required: true,
        // Custom validation will only work for adding new users not for updating existing users but if you want to update existing users you can make validation true in your app.js update user route from there then it will validate for gneder
        validate(value){
            if(!['Male','Female','Others'].includes(value)){
                throw new Error('Invalid gender');
            }
        }
    },
    photoUrl:{
        type: String,
        default: 'jhttps://picsum.dev/image/1191/size', // Optional field for user photo URL
        validate(vlue){
            // Validate URL format using validator library
            // This will ensure that the photoUrl is a valid URL if provided
            if(!validator.isURL(value)){
                throw new Error('Invalid URL format for photo');
            }
        }

    },
    skills:{
        type: [String], // Array of strings for user skills
    }
},{timestamps: true}); // Automatically add createdAt and updatedAt timestamps


userSchema.methods.getJWT = function(){
    
    const user = this; 
    
    // 'this' refers to the instance of the User model so when i will call this method from login api lets suppose so that login would have already created the user instance which will have the data like name id email etc so basically userschema is that main user instance we are setting the value of user if i do this it will refer to that data only.
    // Now we will create a JWT token with the user id and secret key

    const token = jwt.sign({_id : user._id}, config.tokenSecret, {expiresIn: '1d'}); 
    return token; 
}

userSchema.methods.validatePassword = async function(userInputPassword) {
    const user = this;
    let hashedPassword = user.password; // Get the hashed password from the user instance
    return await bcrypt.compare(userInputPassword, hashedPassword);
}


module.exports = mongoose.model('User', userSchema); // Export the User model so it can be used in other files
