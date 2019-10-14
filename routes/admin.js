const express=require('express');
const router=express.Router();
const mongoose = require('mongoose');
const Category = require('../models/Category');
const msg=require('../models/Message');
const product=require('../models/Product');
const order = require('../models/Order');
const { ensureAuthenticated } = require("../config/auth.js");
const checkAuth = require("../config/check_auth");

// router.get('/addCategory', checkAuth,(req,res)=>{
//     res.send({type:"get request"});
// });

router.post('/addCategory',(req,res)=>{
    newCategory={name:req.body.name};
    Category.create(newCategory)
    .then(Category=>{
        console.log('New category is added'+Category);
        res.send(Category);
    })
    .catch(err=>{
        console.log(err);
    });
});


router.post('/addProduct/:category_id', (req, res) => {
    newProduct = { category: req.params.category_id, name: req.body.name, price: req.body.price, image: req.body.image };
    product.create(newProduct)
        .then(product => {
            console.log('product is created successfully' + product);
            res.send(product);
        })
        .catch(err => {
            if (err) throw err;
        });
});

router.get('/viewMsgs',(req,res)=>{
    msg.find({})
        .then((msgs) => {
            res.status(200).json({msgs
            });
        })
        .catch(err => {
            if (err) throw err;
    })
});

router.delete('/deleteMsg/:id', checkAuth ,(req,res)=>{
    msg.remove({_id:req.params.id})
    .then(()=>{
        res.send({type:'deleted successfully'});
    })
    .catch(err=>{
        if(err) throw err;
    });
    
});

router.put('/updateOrder/:order_id', checkAuth ,(req,res)=>{
    order.findOne({_id:req.params.order_id})
    .then(order=>{
        order.status=req.body.status;
        order.save(err=>{
            if(err) throw err;
            res.send({success:"Order updated successfully"});
        });
    })
    .catch(err=>{
        if(err) throw err;
    });
});

//exporting module
module.exports=router;