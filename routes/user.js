const express=require('express');
const router=express.Router();
const mongoose=require('mongoose');
const bodyParser = require('body-parser');
const jwt = require("jsonwebtoken");
// this one is used to hash the password
const bcrypt=require('bcryptjs');
const passport=require('passport');
const { ensureAuthenticated } = require('../config/auth.js');
const checkAuth = require("../config/check_auth");
//Loading user model
const user=require('../models/User');
const cart=require('../models/cart');

//routing

router.get('/logout',ensureAuthenticated, (req, res) => {
  req.logout();
  res.redirect('/');
});

router.post('/login', (req, res, next) => {
  console.log(req.body);
  console.log('hello');
  user.findOne({username:req.body.username})
  .then((user)=>{
    if(user)
    {
      console.log(user.usertype);
      console.log('above is the user object in database');
      /* basically .compare is function which is used to match password with password in database it 
           takes first argument as given password and second argument the password you want to match with and
           third a callback function which has 2 paras isMatch is true if match else false*/
      bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
        if (isMatch) {
          // here we are going to create new token using .sign method on jwt based on someinput data of your choice as 1st para and 2nd is our secret this will only be stored on server and used to cracked that hashes and 3rd para is optional experies specifies the duration of token
          //console.log(user._id);
          const token = jwt.sign({ username: user.username }, 'secret_should_be_longer', { expiresIn: '1h' });
          res.status(200).json({
            token: token,
            userId: user._id,
            userType: user.usertype,
            expiresIn: 3600
          });
        }
        else {
          console.log('password incorrect is sended');
          res.status(500).json({ error: "Password Incorrect" });
        }
      });
    }
    else
    {
      console.log('user must sign up first is sended');
      res.status(500).json({
        error: "User must SignUp first"
      });
    }
  })
  .catch(err=>{
    console.log(err);
  });
});

//signing up
router.post('/signup', (req, res) => {
  console.log('request is landed');
  user.findOne({username:req.body.username})
  .then((User)=>{
    if(User)
    {
      console.log('Username must needs to be unique');
      res.status(500).json({
        error: "username already Exist"
      });
      return;
    }
    else
    {
      const newUser={ username:req.body.username,password:req.body.password,phonenumber:req.body.phonenumber,usertype:req.body.usertype};
      /* gensalt is a function which is used to generate a salt it take in the length as first argument and second 
      paramater as an callback function . salt is kind of key used for encryption as we saw in network security.*/
      bcrypt.genSalt(10,(err,salt)=>{
        /* bcrypt.hash is also a function which actually returns us the real hash it takes in the string as first
        parameter you want to have a hash of and then the salt as 2nd parameter and third parameter is callback function
        which returns the actual hash */
        bcrypt.hash(newUser.password,salt,(err,hash)=>{
          console.log(hash);
          newUser.password=hash;
          user.create(newUser)
          .then((User)=>{
            console.log('New user is created successfullly : '+User);
            newCart={owner:User._id};
            cart.create(newCart)
            .then(cart=>{
              console.log('Cart is created');
            })
            .catch(err=>{
              if(err) throw err;
            });
            // res.send({ success: "user is created along with cart" });
            res.status(200).json({
              message: "user is created successfully"
            });
          })
          .catch((err)=>{
            console.log(err);
          });
        });
      });
    }
  })
  .catch(err=>{
    console.log(err);
  });
});

    
router.get('/:user_id', checkAuth,(req,res)=>{
  //this show profile html page
  user.findOne({ _id: req.params.user_id })
    .then(user => {
      res.send(user);
    })
    .catch(err => {
      if (err) throw err;
    });
});

router.delete('/:user_id', checkAuth,(req,res)=>{
  user.remove({_id:req.params.user_id})
  .then(()=>{
    res.send({type:'deleted successfully'});
    })
    .catch(err=>{
        if(err) throw err;
    });
});

router.post('/changePassword', (req, res) => {
  console.log('yes we do recieve change password request');
  console.log(req.body);
  user.findOne({ username: req.body.username })
    .then((user) => {
      bcrypt.genSalt(10,(err,salt)=>{
        /* bcrypt.hash is also a function which actually returns us the real hash it takes in the string as first
        parameter you want to have a hash of and then the salt as 2nd parameter and third parameter is callback function
        which returns the actual hash */
        bcrypt.hash(req.body.password,salt,(err,hash)=>{
          console.log(hash);
          user.password=hash;
          user.save(err => {
            if (err) throw err;
            res.status(200).send({ message: "Password is changed successfully" });
          });
          return;
        });
      });
    })
    .catch((err) => {
      if (err) throw err;
  })
});

router.put('/', checkAuth, (req, res) => {
  console.log(req.body);
  user.findOne({ _id: req.body.userid })
    .then(userer => {
      user.findOne({ username: req.body.username })
        .then((User) => {
          if (User) {
            console.log('Username must needs to be unique');
            if (req.body.phonenumber) {
              userer.phonenumber = req.body.phonenumber;
            }
            userer.save(err => {
              if (err) throw err;
              res.status(200).send({ message: "Username must needs to be unique while phonenumber is updated" });
            });
            return;
          }
          else {
            if (req.body.username) {
              userer.username = req.body.username;
            }
            if (req.body.phonenumber) {
              userer.phonenumber = req.body.phonenumber;
            }
            userer.save(err => {
              if (err) throw err;
              res.status(200).send({ message: "Successfully Updated" });
            });
          }
        })
        .catch(err => {
          res.send(err);
        });
    })
    .catch(err => {
      res.send(err);
    });
});
//exporting module
module.exports=router;
