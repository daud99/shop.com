const express = require('express');
const router = express.Router();
const product = require('../models/Product');
const multer = require('multer');
const cart = require('../models/cart');
const category = require('../models/Category');
const path = require('path');
/*new Route for Cards*/

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log('i am in multer');
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error("Invalid mime type");
        if (isValid) {
            error = null;
        }
        cb(error, path.join(__dirname,'../uploads'));
        
    },
    filename: (req, file, cb) => {
        console.log('i am in filename thing');
        // const name = file.originalname.toLowerCase().split(' ').join('-');
        // const ext = MIME_TYPE_MAP[file.mimetype];
        var now = new Date();
        // cb(null, file.fieldname + "_" + now.toISOString().replace(/:/g, '-') + "_" + file.originalname);
        cb(null, now.toISOString().replace(/:/g, '-')+path.extname(file.originalname));
        // cb(null, name + '-' + Date.now() + '.' + ext);
    }
})
router.get('/forhome', (req, res) => {
    var limit = 8;
    product
        .find({})
        .limit(limit)
        .exec((err, products) => {
            if (err) throw err;
            res.send(products);
        });
});

router.get('/allcategories', (req, res) => {
    category.find({})
        .then((categorys) => {
            console.log('yes i did send all the categories');
            console.log(categorys);
            res.status(200).json({ categorys });
    })
})

router.get('/:category', (req, res) => {
    console.log('nn' + req.params.category);
    /* basiccaly what we are trying to do here is to view all product in each category here req.params.id
    will be the id of category, it will basically return all product of given category id
    moreover, .populate is a function which is bacially making us available the attributes of the category as
    well which we passed in so that we can access them such product.category.name that will give as the name of
    category and here .exec is basically a function stands for execute used to execute the function*/
    console.log(req.params.category );
    product.find({ category: req.params.category })
        .then((products) => {
            console.log(products);
        res.status(200).json({products});
    })
    .catch(err => {
        if (err) throw err;
    })
});

router.get('/view/:product_id', (req, res) => {
    // this route is to show single product
    product.findById({ _id: req.params.product_id })
        .then(product => {
            console.log('Product is ' + product);
            res.send(product);
        })
        .catch(err => {
            console.log(err);
        });
});
router.post('/search', (req, res) => {
    // const regex = req.body.name.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    const regex = req.body.name;
    // const keyword = new RegExp(regex, 'gi');
    // gi is some sort of flags which ignore lower uppercase casing
    // console.log(keyword);
    product.find({ name: regex })
        .then(products => {
            console.log('product is');
            console.log(products);
            res.send(products);
        })
        .catch(err => {
            if (err) throw err;
        })
});

router.post('/addproduct', multer({ storage: storage }).single("image"), (req, res, next) => {
    console.log('i do receive a request for adding new product');
    console.log( req.body);
    const url = req.protocol + "://" + req.get("host");
    console.log('url is:' + url);
    console.log('req.file.filename is:' + req.file.filename);
    const newProduct = { category: req.body.id, name: req.body.name, price: req.body.price, image: url + "/uploads/" + req.file.filename };
    product.create(newProduct)
        .then((Product) => {
            res.status(201).json({ message: "Post Added Successfully" });
        });
});
//exporting module
module.exports = router;