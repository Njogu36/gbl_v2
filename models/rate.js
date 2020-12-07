const mongoose=require('mongoose');
const rateSchema = mongoose.Schema({
deduct_id:String,

minimum_amount:Number,
maximum_amount:Number,
amount:Number,
company_id:String

})
const Rate = mongoose.model('Rate',rateSchema);
module.exports = Rate