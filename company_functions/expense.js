// LIBRARIES


// IMPORTED FUNCTIONS


// MODELS
const Employee = require('../models/employee')
const Expense = require('../models/expense')
const AppliedExpense = require('../models/applied_expense')
const AppliedLeave = require('../models/applied_leave')
const Company = require('../models/company')

// FUNCTIONS
const expense_page = (req,res)=>{
    Company.findById(req.user.company_id,(err,company)=>{
        
        if(!company.enabled)
        {
            req.flash('danger','License has expired. Please contact the administrator for renewal: Email: '+process.env.EMAIL)
            res.redirect('/company/validate_license')
        }
        else
        {
            Employee.find({company_id:req.user.company_id},(err,employees)=>{
                AppliedExpense.find({company_id:req.user.company_id},(err,expenses)=>{
                    AppliedLeave.find({company_id:req.user.company_id,status:'Pending'}, (err, leaves2) => {
                        AppliedExpense.find({company_id:req.user.company_id,status:'Pending'},(err,expenses2)=>{
                
                    res.render('./company/expense/expense.jade',{
                        user:req.user,
                        employees:employees,
                        expenses:expenses,
                        expenses2:expenses2,
                        leaves2:leaves2,
                        company:company
        
                    })
                })
            })
                }).sort({_id:-1})
                
            })
        }})
   
}

const activate_expense = (req,res)=>{
    const id = req.params.id;
    
    let query = {
        _id:id
    }
    let data = {};
    data.status = 'Active'
    AppliedExpense.update(query,data,(err)=>{
         req.flash('info','Expense accepted.');
         res.redirect('/company/expenses')
    })

}

const decline_expense = (req,res)=>{
    const id = req.params.id;
   
    let query = {
        _id:id
    }
    let data = {};
    data.status = 'Declined'
    AppliedExpense.update(query,data,(err)=>{
        req.flash('danger','Expense declined.');
        res.redirect('/company/expenses')
 
    })


}


// MODULE EXPORTED
module.exports = {
    expense_page:expense_page,
    activate_expense:activate_expense,
    decline_expense:decline_expense

}