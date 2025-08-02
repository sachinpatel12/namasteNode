const mongoose = require('mongoose');

 connectDB = async () =>{
    await mongoose.connect(process.env.DB_CONNECTION_STRING);
}

module.exports = connectDB; // Export the connectDB function so it can be used in other files
