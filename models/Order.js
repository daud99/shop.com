const mongoose = require('mongoose');
const Schema = mongoose.Schema;

autoIncrement = require('mongoose-auto-increment');

var connection = mongoose.createConnection("mongodb://localhost:27017/tranchulas");

autoIncrement.initialize(connection);


const orderSchema = new Schema({
 
  ownerid:{
    type: Number,
    ref: 'user',
    required:true
  },
  orderno:{
    type:Number,
    required:true
  },
  cust_name: {
    type: String,
    required:true
  },
  total:{
    type:Number,
    required:true
  },
  status:{
    type:String,
    required:true
  },
  delivery_date:{
    type:Date,
    default:+ new Date() + 7 * 24 * 60 * 60 * 1000
  },
  date:{
    type:Date,
    default:Date.now
  },
  addressid: {
    type: Number,
    ref: 'address',
    required: true
  }
});

orderSchema.plugin(autoIncrement.plugin, 'orders');
let orders = module.exports = mongoose.model('orders', orderSchema);

