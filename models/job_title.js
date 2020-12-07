const mongoose = require('mongoose');
const JobTitleSchema = mongoose.Schema({
 title:String,
 company_id:String,
 created_by:String,
 created_on:String
});
const JobTitle = mongoose.model('JobTitle',JobTitleSchema)
module.exports = JobTitle;