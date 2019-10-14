const express=require('express');
const mongoose=require('mongoose');
const isUndefined = require("is-undefined");
const addresses = require('../models/address');
const router=express.Router();
const { ensureAuthenticated } = require('../config/auth');
const checkAuth = require("../config/check_auth");


const Order=require('../models/Order');


router.get('/', checkAuth,(req,res)=>{
  //console.log(req.user.usertype);
  const phoneno=req.user.phonenumber;
  if(!(isUndefined(req.user))){
    if(req.user.usertype!="Administrator")
    {
      Order.find({custphoneno:phoneno})
        .sort({date:'desc'})
        .then(order=>{
          res.render('order/order',{order:order});
          });
    }
    else {

      Order.find({})
        .sort({date:'desc'})
        .then(order=>{
          res.render('order/order',{order:order});
        });
    }
  }
});

router.get('/allOrders', (req, res) => {
  Order.find({})
    .sort({ date: 'desc' })
    .then(orders => {
      res.status(201).json({ orders });
    })
    .catch(err => {
      if (err) throw err;
    })
})

router.get('/currentOrders/:id', (req, res) => {
  console.log('i received the request');
  console.log('id i got is' + req.params.id);
  Order.find({ownerid: req.params.id})
    .then(orders => {
      res.status(201).json({ orders:orders });
    })
  .catch(err=>{
    if (err) throw err;
  })
});

router.delete('/deleteOrder/:orderid', (req, res) => {
  Order.remove({_id:req.params.orderid})
    .then(()=>{
        res.status(200).json({message:'Order is Deleted successfully'});
    })
    .catch(err=>{
        if(err) throw err;
    });
});

router.post('/',(req,res)=>{
  searchNo=req.body.search;
  if(searchNo!="")
  {
    if(searchNo.length<10)
    {
      Order.findOne({orderno:searchNo})
      .then(order=>{
        res.render('order/order',{order:order});
      });
    }
    else
    { if(req.body.category=="All Categories")
      {
        Order.find({custphoneno:searchNo})
        .then(order=>{
          res.render('order/order',{order:order});
        });
      }
      else
      {
        Order.find({custphoneno:searchNo,category:req.body.category})
        .then(order=>{
          res.render('order/order',{order:order});
        });
      }
    }
  }
  else
  {
    if(req.body.category=="All Categories")
    {
      res.redirect('/order/');
    }
    else
      {
        Order.find({category:req.body.category})
        .then(order=>{
          res.render('order/order',{order:order});
        });
      }
  }
});


router.post('/insertOrder', (req, res) => {
  
      const newOrder={ownerid:req.body.ownerid,cust_name:req.body.cust_name,total:req.body.total,status:req.body.status};
      new Order(newOrder)
      .save()
      .then(order=>{
        res.status(200).json(order);
      })
      .catch(err=>{
        console.log(err);
      });

});

router.get('/trackOrder/:orderno', (req, res) => {
  console.log('yes i do receive the request with orderno' + req.params.orderno);
  Order.findOne({ orderno: req.params.orderno })
    .then(order => {
      console.log('order is');
      console.log(order);
        res.status(200).json(order);
    })
    .catch((err) => {
      console.log('yess error');
      if (err) {
        res.status(500).json(err);
      }
  })
});

router.get('/insertOrder',ensureAuthenticated,(req,res)=>{
  if(isUndefined(req.user.usertype))
  {
    req.flash('error_msg','Not authorized');
    res.redirect('/');
    return;
  }
  res.render('order/insertOrder');
});
router.get('/orderview',(req,res)=>{
      res.render('order/view');
});

router.post('/orderview',(req,res)=>{
  Order.find({orderno:req.body.orderno})
    .then(order=>{
      res.render('order/view',{order:order});
    });
});



//exporting module
module.exports=router;
