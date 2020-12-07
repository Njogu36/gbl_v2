const mongoose = require('mongoose');
const adminCompanySchema = mongoose.Schema({
    first_name:String,
    last_name:String,
    username:String,
    company_id:String,
    company_name:String,
    role:String,
    password:String,
});
const AdminCompany = mongoose.model('AdminCompany',adminCompanySchema);
module.exports=  AdminCompany;