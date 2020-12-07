const mongoose = require('mongoose');
const loanSchema = mongoose.Schema({
    title:String,
    company_id:String,
    
    code:String
})
const Loan = mongoose.model('Loan',loanSchema);
module.exports = Loan