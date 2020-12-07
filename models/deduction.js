const mongoose = require('mongoose');
const deductSchema = mongoose.Schema({
    title:String,
    status:String,
    rate:Boolean,
    company_id:String,
    code:String,
    type:String
   
})
const Deduct = mongoose.model('Deduct',deductSchema);
module.exports = Deduct