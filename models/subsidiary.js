const mongoose = require('mongoose');
const SubsidiarySchema = mongoose.Schema({
name:String,
email:String,
phone_no:String,
company_id:String,
country:String
})

const Subsidiary = mongoose.model('Subsidiary',SubsidiarySchema);
module.exports =Subsidiary