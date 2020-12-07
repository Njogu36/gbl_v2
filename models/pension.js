const mongoose = require('mongoose');
const pensionSchema = mongoose.Schema({
company_id:String,
employee_percentage:Number,
employer_percentage:Number,
maximum_amount:Number


});
const Pension = mongoose.model('Pension', pensionSchema);
module.exports = Pension