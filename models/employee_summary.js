const mongoose = require('mongoose');
const EmployeeSummarySchema = mongoose.Schema({
    no:Number,
company_id:String,
deductions:Number,
benefits:Number,
expenses:Number,
loans:Number,
pensions:Number,
tax_exemption:Number,
relief:Number,
PAYE:Number,
net_pay:Number,
gross_pay:Number,
month:String,
month2:String,
approved:Boolean,
year:Number,
pay_no:[]

});
const EmployeeSummary = mongoose.model('EmployeeSummary',EmployeeSummarySchema);
module.exports = EmployeeSummary