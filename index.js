const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
//Write the authenication mechanism here
const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: 'Access denied. Token missing.' });
  }

  try {
    // Verify the token and extract the payload
    const decoded = jwt.verify(token, "access");

    // Attach the payload to the request object for further processing
    req.user = decoded;

    // Continue to the next middleware
    next();
  } catch (error) {
    // Handle token verification errors
    return res.status(401).json({ error: 'Invalid token.' });
  }

});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
