const mongoose = require('mongoose');
const houseSchema = mongoose.Schema({
    type:String,
    value:Number,
    company_id:String
})
const House = mongoose.model('House',houseSchema);
module.exports = House