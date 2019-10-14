var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CategorySchema = new Schema({
    /* unique:true ensures that everyvalue of category has to be unique
    so that there should not be any redundancy , ON other hand what lowercase:true
    do is automatically saves the given value in lower case even if the given value
    is in capital the value saved in database will be in lowercase */
    name: { type: String, unique: true, required: true }
});


let categories = module.exports = mongoose.model('Category', CategorySchema);