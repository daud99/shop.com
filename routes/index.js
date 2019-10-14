const express = require('express');
const jwt = require("jsonwebtoken");
const product=require('./product');
const user=require('./user');
const contact=require('./contact');
const admin=require('./admin');
const cart = require('./cart');
const order = require('./order');

var appRouter=function(app){
    
    // app.get(['/','/index'],(req,res)=>{
    //     res.send(req.user);
    // });
    // app.get('/help',(req,res)=>{
    //     res.send({type:'get'});
    // });
    
    // use the router modules
    app.use('/product',product);
    app.use('/user',user);
    app.use('/contact',contact);
    app.use('/admin',admin);
    app.use('/cart', cart);
    app.use("/order", order);
    app.use((req, res, next) => {
        res.sendFile(path.join(__dirname,"angular", "index.html"));
    });
    app.get('*',(req,res)=>{
        res.send('ERROR! 404 NOT FOUND');
    });
};

module.exports=appRouter;
