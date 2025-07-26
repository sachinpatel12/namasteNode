const mongoose = require('mongoose');

 connectDB = async () =>{
    await mongoose.connect('mongodb+srv://sachinpatelsdl:Sachin%40123@namastenode.wqowjxg.mongodb.net/devTinder');
}

module.exports = connectDB; // Export the connectDB function so it can be used in other files
