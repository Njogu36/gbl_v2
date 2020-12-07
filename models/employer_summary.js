const mongoose = require('mongoose');
const EmployerSummarySchema = mongoose.Schema({
    no:Number,
company_id:String,
NITA:Number,
PENSION:Number,
NHIF:Number,
NSSF:Number,
PAYE:Number,
net_pay:Number,
gross_pay:Number,
month:String,
month2:String,
approved:Boolean,
year:Number,
pay_no:[]

});
const EmployerSummary = mongoose.model('EmployerSummary',EmployerSummarySchema);
module.exports = EmployerSummary