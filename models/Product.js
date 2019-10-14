var mongoose = require('mongoose');
var Schema = mongoose.Schema;

autoIncrement = require('mongoose-auto-increment');

var connection = mongoose.createConnection("mongodb://localhost:27017/tranchulas");

autoIncrement.initialize(connection);

var ProductSchema = new Schema({
  category: { type: Schema.Types.ObjectId, ref: 'Category'},
  name: String,
  price: Number,
  description: String,
  image: String
});

ProductSchema.plugin(autoIncrement.plugin, 'Product');
let products=module.exports = mongoose.model('Product', ProductSchema);
