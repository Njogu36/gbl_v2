const mongoose = require('mongoose');
const bankSchema = mongoose.Schema({
    title:String
})
const Bank = mongoose.model('Bank',bankSchema);
module.exports = Bank