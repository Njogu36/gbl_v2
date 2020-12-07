const mongoose = require('mongoose');
const reliefSchema = mongoose.Schema({
item:String,
company_id:String,
amount:Number,
maximum_amount:Number,
maximum_mode:String,
percentage:Boolean
});
const Relief = mongoose.model('Relief', reliefSchema);
module.exports = Relief