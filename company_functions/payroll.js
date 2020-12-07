// LIBRARIES


// IMPORTED FUNCTIONS


// MODELS
const Employee = require('../models/employee')

// FUNCTIONS
const payroll_page = (req, res) => {
    Employee.find({}, (err, employees) => {
        res.render('./company/payroll/payroll.jade', {
            user: req.user,
            employees: employees
        })
    })
}



// MODULE EXPORTED
module.exports = {
    payroll_page: payroll_page

}