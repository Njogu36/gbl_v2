const mongoose = require('mongoose');
const appliedExpense = mongoose.Schema({
employee:String,
department:String,
company:String,
company_id:String,
type:String,
receipt:String,
message:String,
feedback:String,
currency:String,
amount:Number,
employee_id:String,
status:String,
accepted:Boolean,
accepted_on:String,
accepted_by:String,
added_on:String,
});
const AppliedExpense = mongoose.model('AppliedExpense',appliedExpense);
module.exports = AppliedExpense