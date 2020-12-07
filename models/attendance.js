const mongoose = require('mongoose');
const attendanceSchema = mongoose.Schema({
    company_id:String,
    employee_id:String,
    emp:String,
    department:String,
    hours:Number,
    date:String,
    approved:Boolean

})
const Attendance = mongoose.model('Attendance',attendanceSchema);
module.exports = Attendance