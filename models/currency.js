const mongoose = require('mongoose');
const currencySchema = mongoose.Schema({
    code:String,
    country:String
})
const Currency = mongoose.model('Currency',currencySchema);
module.exports = Currency