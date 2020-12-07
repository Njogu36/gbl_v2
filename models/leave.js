const mongoose = require('mongoose');
const leaveSchema = mongoose.Schema({
    title:String,
    company_id:String,
    
})
const Leave = mongoose.model('Leave',leaveSchema);
module.exports = Leave