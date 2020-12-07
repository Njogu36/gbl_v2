const mongoose = require('mongoose');
const CompanySchema = mongoose.Schema({
 name:String,
 email:String,
 license_id:String,
 country:String,
 icon:String,
 logo:String,
 subscription:String,
 status:String,
 enabled:Boolean,
 employees:Number,
 created_on:Date,
 currency:String,

})
const Company = mongoose.model('Company',CompanySchema);
module.exports = Company;