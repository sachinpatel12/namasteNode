
const express = require('express'); // this will load the express module from node_modules folder 

const app = express(); // this will create an instance of xpress

app.use('/',(req, res)=>{
    res.send('Hello from the server blank'); // this will send a response to the client
}); // this is a middleware function that will be executed for every request

app.use('/hello',(req, res)=>{
    res.send('Hello from the server side'); // this will send a response to the client
}); // this is a middleware function that will be executed for every request

//we need to set the listener for the server on port 3000
app.listen(3000, () =>{
    console.log('Server is running on port 3000');
})
