const mongoose = require('mongoose');
const ccSchema = mongoose.Schema({
    company_id:String,
    cubic_centimetres:Number,
    amount:Number
});
const CC = mongoose.model('CC',ccSchema);
module.exports =CC