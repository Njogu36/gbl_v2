const mongoose = require('mongoose');
const employeeBenefit = mongoose.Schema({
    type:String,
    employee_id:String,
    company_id:String,
    car_benefit_details:{},
    per_diem_details:{},
    meal_benefit_details:{},
    furniture_details:{},
    non_cash_allowances_details:{},
    mobile_benefit_details:{},
    housing_allowance_details:{},
    amount:Number,
    status:String,
    post:String,
    added_on:String
});
const EmployeeBenefit =  mongoose.model('EmployeeBenefit',employeeBenefit);
module.exports = EmployeeBenefit;