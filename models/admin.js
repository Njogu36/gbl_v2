const mongoose = require('mongoose');
const adminSchema = mongoose.Schema({
    first_name:String,
    last_name:String,
    username:String,
    role:String,
    
    password:String,
});
const Admin = mongoose.model('Admin',adminSchema);
module.exports=  Admin;