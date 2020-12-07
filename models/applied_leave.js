const mongoose = require('mongoose');
const appliedLeave = mongoose.Schema({
employee:String,
department:String,
company:String,
company_id:String,
type:String,
start_date:String,
end_date:String,
message:String,
feedback:String,
employee_id:String,
status:String,
accepted:Boolean,
accepted_on:String,
accepted_by:String,
applied_on:String,
});
const AppliedLeave = mongoose.model('AppliedLeave',appliedLeave);
module.exports = AppliedLeave