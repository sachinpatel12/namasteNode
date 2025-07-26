
const express = require('express'); // this will load the express module from node_modules folder 

const app = express(); // this will create an instance of xpress




//we need to set the listener for the server on port 3000
app.listen(3000, () =>{
    console.log('Server is running on port 3000');
})
