const mongoose = require('mongoose');
const DepartmentUserSchema = mongoose.Schema({
    company_id:String,
    department_id:String,
    department:String,
    email:String,
    password:String,

})
const DepartmentUser = mongoose.model('DepartmentUser',DepartmentUserSchema);
module.exports =  DepartmentUser