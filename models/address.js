const mongoose = require('mongoose');
const Schema=mongoose.Schema;

autoIncrement = require('mongoose-auto-increment');

var connection = mongoose.createConnection("mongodb://localhost:27017/tranchulas");

autoIncrement.initialize(connection);

const addressSchema = new Schema({
    ownerid: {
        type: Number,
        ref: 'user',
        required: true
    },
    houseno:{
        type:Number,
        required:true
    },
    streetno:{
        type:Number,
        required:true
    },
    town:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    country:{
        type:String,
        required:true
      }
})

addressSchema.plugin(autoIncrement.plugin, 'addresses');
let addresses = module.exports = mongoose.model('addresses', addressSchema);