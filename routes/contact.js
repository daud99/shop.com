const express=require('express');
const router=express.Router();
const msg=require('../models/Message');

// router.get('/',(req,res)=>{
//     res.send({type:'get'});
//     res.end('This url will serve contact page');
// });
router.post('/',(req,res)=>{
    newMsg={name:req.body.name,email:req.body.email,message:req.body.message};
    msg.create(newMsg)
    .then(msg=>{
        res.status(200).json({
            message: "Successfully Added"
        });
    })    
    .catch(err=>{
        console.log(err);
    });
});

//exporting module
module.exports=router;