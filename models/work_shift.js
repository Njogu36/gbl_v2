const mongoose = require('mongoose');
const ShiftSchema = mongoose.Schema({
    title:String,
    start_time:String,
    end_time:String,
    break_hours:Number,
    company_id:String,
    work_hours:Number,
    days:[]

});
const Shift = mongoose.model('Shift',ShiftSchema);
module.exports = Shift