const mongoose = require('mongoose');
const benefitSchema = mongoose.Schema({
    title:String,
    taxable:String,
    value:Number,
    percentage:Boolean,
    company_id:String,
    code:String,
    status:String
})
const Benefit = mongoose.model('Benefit',benefitSchema);
module.exports = Benefit