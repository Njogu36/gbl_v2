const mongoose = require('mongoose');
const DepartmentTitleSchema = mongoose.Schema({
 title:String,
 created_by:String,
 company_id:String,
 created_on:String,
 casual:Boolean
});
const DepartmentTitle = mongoose.model('DepartmentTitle',DepartmentTitleSchema)
module.exports = DepartmentTitle;   