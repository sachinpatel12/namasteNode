const validator = require('validator'); // Importing validator for input validation

isValidBody = (req) =>{
    if(!req.body.firstName && !req.body.lastName) {
        
        throw new Error("First name and last name are required");
    }
    if(req.body.emailId) {
        if(!validator.isEmail(req.body.emailId)){
            throw new Error("INVALID EMAIL FORMAT");
        }
    }else{
        throw new Error("EMAIL ID IS REQUIRED");
    }
    if(req.body.password) {
        if(!validator.isStrongPassword(req.body.password)){
            throw new Error("VALIDATION ERROR - Password must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, one number, and one symbol.");
        }
    }else{
        throw new Error("VALIDATION ERROR - Password is required");
    }
}

const validateEditProfileData = (req) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "emailId",
    "photoUrl",
    "gender",
    "age",
    "about",
    "skills",
  ];

  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field)
  );

  return isEditAllowed;
};

module.exports = {
    isValidBody,
    validateEditProfileData
}