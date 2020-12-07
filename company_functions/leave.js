// LIBRARIES


// IMPORTED FUNCTIONS


// MODELS
const Employee = require('../models/employee')
const Leave = require('../models/leave')
const AppliedLeave = require('../models/applied_leave');
const AppliedExpense = require('../models/applied_expense')
const Company = require('../models/company')

// FUNCTIONS
const date = require('../company_functions/date')
const leave_page = (req, res) => {
    Company.findById(req.user.company_id,(err,company)=>{
        
        if(!company.enabled)
        {
            req.flash('danger','License has expired. Please contact the administrator for renewal: Email: '+process.env.EMAIL)
            res.redirect('/company/validate_license')
        }
        else
        {
            Employee.find({company_id:req.user.company_id}, (err, employees) => {
                AppliedLeave.find({company_id:req.user.company_id}, (err, leaves) => {
                    AppliedLeave.find({company_id:req.user.company_id,status:'Pending'}, (err, leaves2) => {
                        AppliedExpense.find({company_id:req.user.company_id,status:'Pending'},(err,expenses2)=>{
                
                    res.render('./company/leave/leave.jade', {
                        user: req.user,
                        employees: employees,
                        leaves: leaves,
                        leaves2:leaves2,
                        expenses2:expenses2,
                        company:company,
                    })
                })
            })
                }).sort({_id:-1})
        
            })

        }})
  
}

const accept_leave = (req, res) => {
    let { id } = req.body;
    let query = {
        _id:id
    }
    let data = {}
    data.accepted = true;
    data.accepted_on = date.today;
    data.accepted_by = req.user.first_name + ' '+req.user.last_name;
    data.status = 'Accepted';
    AppliedLeave.update(query,data,()=>{
        req.flash('info','Leave accepted successfully')
        res.redirect('/company/leaves')
    })

}
const decline_leave = (req, res) => {
 
    let { id } = req.body;
    let query = {
        _id:id
    }
    let data = {}
    data.accepted = false;
     data.status = 'Declined';
    AppliedLeave.update(query,data,()=>{
        req.flash('info','Leave declined successfully')
        res.redirect('/company/leaves')
    })

}

const get_leave_details = (req,res)=>{
    const id = req.params.id
    AppliedLeave.findById(id,(err,leave)=>{
        let query = {
            _id:req.params.id
        }
        let data = {};
        data.status = 'Under Review'
        AppliedLeave.update(query,data,(err)=>{
            res.send({success:true,leave:leave})
        })
        
    })
}


// MODULE EXPORTED
module.exports = {
    leave_page: leave_page,
    accept_leave:accept_leave,
    decline_leave:decline_leave,
    get_leave_details:get_leave_details

}