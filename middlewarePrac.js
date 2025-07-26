const express = reuire('express');
const { isUserAdmin,isValidUser } = require('./middlewares/auth'); // import the middleware function
 
const app = express();

//middlewares are functions that have access to the request object (req), the response object (res), and the next middleware function in the application’s request-response cycle.

//best use of middleware is that if we have to do some common task for all routes like logging, authentication, etc. we can use middleware 


//creating a admin middleware for all routes which will check if the user is admin or not instead of app.use you can use app.all to apply this middleware to all HTTP methods and even for specific routes lie only get it should be applied to get method only so you can use app.get, app.post, app.put, app.delete, etc.


app.use('/admin',isUserAdmin); // this will apply the isUserAdmin middleware to all routes that start with /admin

//if you hit any api with /admin in the path, it will check if the user is admin or not in the middleware function above and then execute the next middleware function or request handler function 
app.get('/admin/getUsersDtail',(req,res) =>{ 
    res.send('you are admin and you can see the users details'); // this will be executed only if the user is admin
})

//other way to use middleware is to use it for specific routes like below
app.get('/users/getUserDetails', isValidUser, (req,res)=>{
    res.send('you are authenticated and you can see the user details'); // this will be executed only if the user is authenticated
    
} )




//ADVANCE ROUTING

// /abc, ac b cn be skipped)
app.get('/ab?c',(req,res)=>{
    console.log('listeniing the route /hello and its subroutes like /hello/sjf/dkjl, /hello/xyx');
})

// /abc, abbbbbbbbc as many as b only )
app.get('/ab+c',(req,res)=>{
    console.log('listeniing the route /hello and its subroutes like /hello/sjf/dkjl, /hello/xyx');
})
// /abcd, abbbbbbbbcd  any string after ab and before cd)
app.get('/ab*cd',(req,res)=>{
    console.log('listeniing the route /hello and its subroutes like /hello/sjf/dkjl, /hello/xyx');
})

//for all routes put,post,get,delete
app.use('/',(req, res)=>{
    res.send('Hello from the server blank'); 
});

//Query parameters url will be like http://localhost:3000/query?name=John&age=30
app.get('/query',(req, res)=>{
    console.log(req.query); // this will log the query parameters in the console
    res.send('Hello from the server with query parameters'); 
});
//dynamic routing
// /user/1, /user/2/sachin/patel, /user/3
app.get('/user/:id/:firstName/:lastName',(req, res)=>{
    console.log(req.params); // this will log the parameters in the console
    res.send(`Hello from the server with user id ${req.params.id}`); 
});

//regex if endpoint have a it will work
app.use('/a',(req, res)=>{
    res.send('Hello from the server blank'); 
});


// //next middleware function
// app.get('/sendFromMiddleware',
//     (req, res, next) => {
//     console.log('This is the next middleware function'); // this will log the message in the console
//     next(); // this will call the next middleware function
// },
// (req, res) => {
//     res.send('Hello from the server with next middleware function'); // this will send a response to the client
// });





app.listen(3001, () =>{
    console.log('Server is running on port 3000');
})