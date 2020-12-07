// LIBRARIES




// IMPORTED FUNCTIONS
const date = require('./date')

// MODELS
const Employee = require('../models/employee')
const Company = require('../models/company')
const License = require('../models/license')


// FUNCTIONS
const license_page = (req, res) => {
    Employee.find({company_id:req.user.company_id},(err,employees)=>{
        Company.findById(req.user.company_id,(err,company)=>{
            res.render('./company/auth/validate_license.jade',{
                user:req.user,
                company:company,
                employees:employees,
                year:date.year
            })
        })
        
    })
   
}


const validate_license = (req,res)=>{
    const {key} = req.body;
    License.findOne({license:key},(err,license)=>{
        if(license)
        {
            let query = {
                _id:license.company_id
            }
            let data = {}
            data.enabled=true;
            Company.update(query,data,(err)=>{
                res.redirect('/company/employees')
            })

        }
        else
        {
             req.flash('danger','Invalid license key. Try again.')
             res.redirect('/company/validate_license')
        }
    })

}








// MODULE EXPORTED
module.exports = {
    license_page: license_page,
    validate_license:validate_license

}