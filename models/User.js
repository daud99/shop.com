const mongoose=require('mongoose');
const Schema = mongoose.Schema;

autoIncrement = require('mongoose-auto-increment');

var connection = mongoose.createConnection("mongodb://localhost:27017/tranchulas");

autoIncrement.initialize(connection);

const userSchema = new Schema({
  username:{
    type:String,
    required:true
  },
  password:{
    type:String,                                                          
    required:true
  },
  phonenumber:{
    type:Number,
    required:true
  },
  usertype:{
    type:String,
    required:false
  },
  date:{
    type:Date,
    default:Date.now
  }

});


userSchema.plugin(autoIncrement.plugin, 'users');
let user=module.exports=mongoose.model('users',userSchema);
