const express = require('express');
const path = require('path');
const bodyParser=require('body-parser');
const session=require('express-session');
const passport=require('passport');
const mongoose=require('mongoose');
const db=require('./config/db');
const routes=require('./routes/index');
const autoIncrement = require("mongoose-auto-increment");
const app=express();

//connecting to database
mongoose.connect(db.database,{useNewUrlParser:true})
.then(()=>{
  console.log('Connected to database');
})
.catch((err)=>{
  console.log(err);
});


// the below line allow the angular request to access the uploads folder
app.use("/uploads", express.static(path.join('./uploads')));
app.use("/", express.static(path.join('./angular')));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

//bodyParser middleware
app.use(bodyParser.urlencoded({extended: false}));
// we are setting up the format we want req.body to return, here json.....
app.use(bodyParser.json());

// Express session midleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  }));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

routes(app);

Passport=require('./config/passport');
/* basically what we are doing here is passing the passport as an argument 
to the function in passport.js file we are requiring here ...*/
Passport(passport);

const port=3400;
app.listen(port,()=>{
    console.log(`You are listening to port ${port}`);
});

module.exports = app;