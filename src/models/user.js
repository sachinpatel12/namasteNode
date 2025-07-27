const mongoose = require('mongoose');
const validator = require('validator'); // Importing validator for input validation

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
        default: 'https://picsum.dev/image/1191/size', // Optional field for user photo URL
        validate(value){
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

module.exports = mongoose.model('User', userSchema); // Export the User model so it can be used in other files
