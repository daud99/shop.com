const mongoose = require('mongoose');
const Schema=mongoose.Schema;

autoIncrement = require('mongoose-auto-increment');

var connection = mongoose.createConnection("mongodb://localhost:27017/tranchulas");

autoIncrement.initialize(connection);

const cartSchema = new Schema({
  owner:{
    type: Number,
    ref: 'user',
    required:true
  },
  total:{
    type:Number,
    default:0,
    required:true
  },
  items:[{
    item:{ type: Number, ref: 'Product', required:true},
    quantity:{ type:Number, default:0, required:true },
    price:{ type:Number, default:0, required:true }
  }]
});

cartSchema.plugin(autoIncrement.plugin, 'cart');
let carts=module.exports=mongoose.model('cart',cartSchema);
