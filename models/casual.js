const mongoose = require('mongoose');
const CasualSchema = mongoose.Schema({
    company_id:String,
    employee_id:String,
    employee:{},
    amount:Number,
    
    
    created_on:Date,
    data_amount:[],
    data_hours:[],
    ban:{
        data:[]
    },
    comments:[],
    day:Number,
 
    department:String,
    month:String,
    year:Number,
    date:String,

    // 1st half
    gross_amount_1st:Number,
    bonus_1st:Number,
    back_pay_1st:Number,
    nhif_1st:Number,
    nssf_1st:Number,
    net_amount_1st:String,

     
  
    // 2nd half
    bonus_2nd:Number,
    back_pay_2nd:Number,
    gross_amount_2nd:Number,
    nhif_2nd:Number,
    nssf_2nd:Number,
    total_month_gross:Number,

    // nhif,nssf,nita
    
    nita:Number,
    nita2:Number,

    // personal relief
    personal_relief:Number,
    
    // Tax
    tax_payable:String,
    tax_deducted:String,

    // net_amount
    
    net_amount_2nd:String,
    

    second_half:Boolean,
    first_half:Boolean


});
const Casual = mongoose.model('Casual',CasualSchema);
module.exports = Casual;