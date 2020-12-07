const mongoose = require('mongoose');
const employeeDeduction = mongoose.Schema({
     type:String,
     employee_id:String,
     company_id:String,
     amount:Number,
     status:String,
     account_name:String,
     account_number:String,
     added_on:String,
     tax:String,

});
const EmployeeDeduction =  mongoose.model('EmployeeDeduction',employeeDeduction);
module.exports = EmployeeDeduction;