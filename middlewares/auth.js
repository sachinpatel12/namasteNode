const isUserAdmin = (req,res,next) =>{
    const isAdmin = req.body.isAdmin; // assuming isAdmin is sent in the request body
    if(isAdmin) {
        console.log('User is admin');
        next(); // if user is admin, call the next middleware
    } else {    
        console.log('User is not admin');
        res.status(403).send('Forbidden'); // if user is not admin, send a forbidden response
    }
};

const isValidUser = (req, res, next) =>{
    const token = req.headers.authorization; // assuming token is sent in the authorization header
    if(token) {
        console.log('User is authenticated');
        next(); // if user is authenticated, call the next middleware
    } else {
        console.log('User is not authenticated');
        res.status(401).send('Unauthorized'); // if user is not authenticated, send an unauthorized response
    }
}

exports.isUserAdmin = {
isUserAdmin,
isValidUser 
} ; // export the middleware function