const mongoose = require('mongoose');
const employeeRelief = mongoose.Schema({
     title:String,
     employee_id:String,
     company_id:String,
     amount:Number,
     maximum_amount:Number,
     status:String,
     insurance_relief_details:{}
});
const EmployeeRelief =  mongoose.model('EmployeeRelief',employeeRelief);
module.exports = EmployeeRelief