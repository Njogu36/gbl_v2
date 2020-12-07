const mongoose = require('mongoose');
const expenseSchema = mongoose.Schema({
    title:String,
    company_id:String,
    
})
const Expense = mongoose.model('Expense',expenseSchema);
module.exports = Expense