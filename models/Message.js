const mongoose = require('mongoose');
const Schema = mongoose.Schema;

autoIncrement = require('mongoose-auto-increment');

var connection = mongoose.createConnection("mongodb://localhost:27017/tranchulas");

autoIncrement.initialize(connection);

const messageSchema=new Schema({
  name:{
    type:String,
    required:true
  },
  email:{
    type:String,
    required:true
  },
  message:{
    type:String,
    required:true
  },
  userid:{
    type:Number, 
    ref: 'User'
  },
  date:{
    type:Date,
    default:Date.now
  }
});

messageSchema.plugin(autoIncrement.plugin, 'msgs');
let msgs=module.exports=mongoose.model('msgs',messageSchema);
