const mongoose = require('mongoose');
const casualSettings = mongoose.Schema({
no:Number,
company_id:String,
mid_day:Number,
end_day:Number,
hours:Number,

})
const CasualSettings = mongoose.model('CasualSettings',casualSettings);
module.exports = CasualSettings