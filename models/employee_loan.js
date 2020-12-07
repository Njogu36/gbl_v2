const mongoose = require('mongoose');
const employeeLoan = mongoose.Schema({
    type:String,
    employee_id:String,
    company_id:String,
    amount:Number,
    status:String,
    account_name:String,
    account_number:String,
    start_date:String,
    end_date:String,
    loan_amount:Number,
    added_on:String
});
const EmployeeLoan =  mongoose.model('EmployeeLoan',employeeLoan);
module.exports = EmployeeLoan;