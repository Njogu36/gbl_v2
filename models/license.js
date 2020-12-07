const mongoose = require('mongoose');
const licenseSchema  = mongoose.Schema({
  company_name:String,
  company_id:String,
  license:String,
  status:String,
  subscription:String,
  start_date:String,
  expire_date:String
})
 const License = mongoose.model('License',licenseSchema);
 module.exports = License