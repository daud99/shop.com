const express = require('express');
const router = express.Router();
const cart = require('../models/cart');
const order = require('../models/Order');
const addresses = require('../models/address');
const { ensureAuthenticated } = require("../config/auth.js");
const checkAuth = require("../config/check_auth");

function randomInt(low, high) {
    console.log('unique number is generated');
    return Math.floor(Math.random() * (high - low) + low)
}

router.post("/totalProduct", checkAuth, (req, res) => {
    console.log(req.body);
    if (req.body) {
        cart.findOne({ owner: req.body.userId })
            .then(cart => {
                console.log(cart.items.length);
                res.status(200).json({ total_item: cart.items.length });
            })
            .catch(err => {
                if (err) throw err;
            });
    }
});
router.post("/addProduct/:product_id", checkAuth, (req, res) => {
    /* user can only add product to cart iff it is logged in otherwise not.*/
    console.log(req.params.product_id);
    cart.findOne({ owner: req.body.userId })
        .then(cart => {
            // as items is array so we use push to add in array
            cart.items.push({
                item: req.params.product_id,
                quantity: parseInt(req.body.quantity),
                price: parseFloat(req.body.price)
            });
            cart.total =
                cart.total + parseFloat(req.body.price) * parseInt(req.body.quantity);
            cart.save(err => {
                if (err) throw err;
                res.send({ success: "Ur product is added in cart" });
            });
        })
        .catch(err => {
            if (err) throw err;
        });
});

router.get('/:id', checkAuth, (req, res) => {
    pp = [];
    cart.findOne({ owner: req.params.id })
        .populate('items.item')
        .exec((err, foundCart) => {
            console.log(foundCart);
            res.send(foundCart);

        });
});

router.post('/removeProduct', checkAuth, (req, res) => {
    cart.findOne({ owner: req.body.userId })
        .then(cart => {
            cart.items.splice(req.body.indexs, 1);
            cart.total = cart.total - (parseFloat(req.body.item.price) * parseInt(req.body.quantity));
            if (cart.total < 0) {
                cart.total = 0;
            }
            cart.save((err) => {
                if (err) throw err;
                res.send({ success: "Ur product is remove from cart" });
            });
        })
        .catch(err => {
            if (err) throw err;
        });
});

router.post('/pay', (req, res) => {
    console.log('req.body is');
    console.log(req.body);
    // console.log("req.body._id is : " + req.body._id);
    // _id = 'ObjectId(' + req.body._id + ')';
    // console.log('_id is: ' + _id);
    // console.log(_id);
    cart.findOne({ owner: req.body._id })
        .then(cart => {
            let orderno = randomInt(0000, 9999);
            // orderno = orderno.toString();
            // console.log(cart);
            // console.log('order no is :' + orderno);
            // console.log('cart total is:' + cart.total);
            // let breaker = true
            // while (breaker) {
            //         console.log('while loop running');
            //         order.findOne({ orderno: orderno })
            //         .then((order) => {
            //             if (order) {
            //                 console.log('order already exit');
            //                 orderno = randomInt(00000, 99999);
            //                 // orderno = orderno.toString();

            //             } else {
            //                 console.log('while loop ended');
            //                 breaker = false;
            //             }
            //         })  
            //             .catch((err) => {
            //                 if (err) {
            //                     throw err;
            //             }
            //         })
            // }
            newAddress = {
                ownerid: req.body._id,
                houseno: req.body.h,
                streetno: req.body.s,
                town: req.body.t,
                city: req.body.c,
                country: req.body.country    
            }
            addresses.create(newAddress)
                .then(address => {
                    newOrder = {
                        ownerid: req.body._id,
                        orderno: orderno,
                        total: req.body.total,
                        status: "pending",
                        cust_name: req.body.name,
                        addressid: address._id
                    };
                    // here in newOrder i am adding total: req.body.total so that user can manipulate the price however it should be total: cart.total
                    order.create(newOrder)
                    .then(order => {
                        cart.items = [];
                        cart.total = 0;
                        cart.save(err => {
                            if (err) throw err;
                            res.status(200).json({ message: 'Your order is successfully placed.' });
                        });
                    })
                    .catch(err => {
                        if (err) throw err;
                    });
            })
        })
        .catch(err => {
            if (err) throw err;
        });
});

router.get('/currentBill/:id', (req, res) => {
    cart.findOne({ owner: req.params.id })
        .then(cart => {
            res.status(200).json({ total: cart.total });
        })
        .catch((err) => {
            if (err) throw err;
    })
});

router.get('/address/:userid', (req, res) => {
    console.log('yes i do receive the request');
    console.log('the userid is ' + req.params.userid);
    addresses.findOne({ownerid: req.params.userid })
      .then(address => {
        console.log('addressses i am going to send are');
        console.log(address);
        res.status(200).json({ address });
      })
      .catch((err) => {
        if (err) throw err;
      })
  });

//exporting module
module.exports = router;