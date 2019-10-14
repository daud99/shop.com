const LocalStrategy=require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const mongoose=require('mongoose');

// load user model
const user=require('../models/User');

module.exports=function(passport){
    /* basically what we are doing here is defining a local strategy which takes in 3 argument 1st is username
    second is passport and third is done which is basically a callback function */
    passport.use(new LocalStrategy((username,password,done)=>{
       user.findOne({username:username})
       .then(user=>{
           if(user)
           {   /* basically .compare is function which is used to match password with password in database it 
            takes first argument as given password and second argument the password you want to match with and
            third a callback function which has 2 paras isMatch is true if match else false*/
               bcrypt.compare(password,user.password,(err,isMatch)=>{
                   if(isMatch)
                   {
                       return done(null, user);
                    //done is function which takes three parameters first error then user last message
                   }
                   else
                   {    
                        return done(null,false,{"message": "Password Incorrect"});
                   }
               });
           }
           else
           {    
                console.log('user not exist');
                return done(null,false,{"message": "User does not exist"});
           }
       })
       .catch(err=>{
           console.log(err);
       });
    }));

/*
The user id (you provide as the second argument of the done function) is saved in the session and is later used to retrieve the whole object via the deserializeUser function.

serializeUser determines which data of the user object should be stored in the session. The result of the serializeUser method is attached to the session as req.session.passport.user = {}. Here for instance, it would be (as we provide the user id as the key) req.session.passport.user = {id: 'xyz'}

We are calling passport.deserializeUser right after it where does it fit in the workflow?
The first argument of deserializeUser corresponds to the key of the user object that was given to the done function (see 1.). So your whole object is retrieved with help of that key. That key here is the user id (key can be any key of the user object i.e. name,email etc). In deserializeUser that key is matched with the in memory array / database or any data resource.

The fetched object is attached to the request object as req.user
*/
    passport.serializeUser(function(user, done) {
        done(null, user.id);
      });
    
    passport.deserializeUser(function(id, done) {
    user.findById(id, function(err, user) {
        done(err, user);
    });
    });
}