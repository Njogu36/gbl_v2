// LIBRARIES
const express = require('express');
const passport = require('passport');
const bcrypt = require('bcryptjs')
var multer = require('multer');
const nodemailer = require("nodemailer");

const auth_user = (req, res, next) => {
    if (!req.user) {
        req.flash('info', 'You are logged out. Kindly login.');
        res.redirect('/')
    }
    else {
        next()
    }
}

const router = express.Router();

var storageReceipt = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/receipts');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
var uploadReceipt = multer({ storage: storageReceipt })

var storageImage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/passport_photos');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
var uploadImage = multer({ storage: storageImage })
// Functions
const date = require('../company_functions/date')

// Models
const AppliedLeave = require('../models/applied_leave');
const Leave = require('../models/leave')
const AppliedExpense = require('../models/applied_expense');
const EmployeeLoan = require('../models/employee_loan');
const EmployeeDeduct = require('../models/employee_deduction');
const EmployeeBenefit = require('../models/employee_benefit')
const Expense = require('../models/expense');
const Pay = require('../models/pay')
const Employee = require('../models/employee');
const Company = require('../models/company')


// Routes
router.get('/', (req, res) => {
    res.render('./selfcare/auth/login.jade')
})
router.get('/forgot_password', (req, res) => {
    res.render('./selfcare/auth/forgot_password.jade')
})



// Leaves
router.get('/leaves', auth_user, (req, res) => {
    Leave.find({}, (err, leaves) => {
        AppliedLeave.find({ employee_id: req.user.id }, (err, myleaves) => {

            res.render('./selfcare/leaves/leaves.jade', {
                user: req.user,
                leaves: leaves,
                myleaves: myleaves
            })
        })

    })
})
router.post('/apply_for_leave', auth_user, (req, res) => {
    const { type, start_date, end_date, message } = req.body;
    const data = new AppliedLeave({
        employee: req.user.first_name + ' ' + req.user.last_name,
        department: req.user.hr_details.department,
        company: req.user.hr_details.company,
        type: type,
        start_date: start_date,
        end_date: end_date,
        message: message,
        feedback: '',
        company_id:req.user.company_id,
        accepted: false,
        employee_id: req.user.id,
        status: 'Pending',
        accepted_on: '',
        accepted_by: '',
        applied_on: date.today,
    });
    data.save(() => {
        req.flash('info', 'Leave added successfuly. ')
        res.redirect('/leaves')
    })
})

router.get('/get_leave_details/:id', auth_user, (req, res) => {
    const id = req.params.id;
    AppliedLeave.findById(id, (err, leave) => {
        res.send({ success: true, leave: leave })
    })
})



router.get('/delete_leave/:id', auth_user, (req, res) => {
    const id = req.params.id
    AppliedLeave.findByIdAndRemove(id, (err) => {
        req.flash('danger', 'Leave deleted successfully.');
        res.redirect('/leaves')
    })
})

// Expenses
router.get('/expenses', auth_user, (req, res) => {
    Expense.find({}, (err, expenses) => {
        AppliedExpense.find({employee_id:req.user.id}, (err, myexpenses) => {
            res.render('./selfcare/expense/expense.jade', {
                user: req.user,
                expenses: expenses,
                myexpenses: myexpenses
            })
        }).sort({ _id: -1 })

    })

})
router.post('/apply_expense', auth_user, uploadReceipt.single('file'), (req, res) => {
    const { type, message, amount } = req.body;

    const path = '/receipts/' + req.file.filename
    const data = new AppliedExpense({
        employee: req.user.first_name + ' ' + req.user.last_name,
        department: req.user.hr_details.department,
        company: req.user.hr_details.company,
        type: type,
        receipt: path,
        message: message,
        feedback: '',
        accepted: false,
        amount: amount,
        company_id:req.user.company_id,
        currency: req.user.salary_details.payment_currency,
        employee_id: req.user.id,
        status: 'Pending',
        accepted_on: '',
        accepted_by: '',
        added_on: date.today,
    });
    data.save(() => {
        req.flash('info', 'Expense added successfuly. ')
        res.redirect('/expenses')
    })
})

router.get('/delete_expense/:id', auth_user, (req, res) => {
    const id = req.params.id
    AppliedExpense.findByIdAndRemove(id, (err) => {
        req.flash('danger', 'Expense deleted successfully.');
        res.redirect('/expenses')
    })
})

// History
router.get('/history', auth_user, (req, res) => {
    Pay.find({ employee_id: req.user.id, status: 'Confirmed' }, (err, pays) => {
        res.render('./selfcare/history/history.jade', {
            user: req.user,
            pays: pays
        })
    }).sort({ _id: -1 })
})

router.get('/view_pay/:id', auth_user, (req, res) => {
    Employee.findById(req.user.id, (err, employee) => {
        Pay.findById(req.params.id, (err, pay) => {
            Company.findById(req.user.company_id,(err,company)=>{
                res.render('./selfcare/history/view_pay.jade', {
                    user: req.user,
                    pay: pay,
                    employee: employee,
                    company:company
                })
            })
            console.log(pay)
           
        })
    })

})





// Profile
router.get('/profile', auth_user, (req, res) => {

    EmployeeBenefit.find({ employee_id: req.user.id }, (err, benefits) => {
        EmployeeDeduct.find({ employee_id: req.user.id }, (err, deducts) => {
            EmployeeLoan.find({ employee_id: req.user.id }, (err, loans) => {
                res.render('./selfcare/profile/profile.jade', {
                    user: req.user,
                    loans: loans,
                    deducts: deducts,
                    benefits: benefits
                })
            })
        })
    })

})
router.get('/edit_profile', auth_user, (req, res) => {
    res.render('./selfcare/profile/edit_profile.jade', {
        user: req.user
    })
})
router.post('/update_password', auth_user, (req, res) => {
    const { password, password2 } = req.body;
    if (password !== password2) {
        req.flash('danger', 'Passwords do not match.')
        res.redirect('/edit_profile')
    }
    else {
        let query = {
            _id: req.user.id
        }
        let data = {};
        data.password = password
        data.pass = password
        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(password, salt, function (err, hash) {
                data.password = hash
                Employee.update(query, data, () => {
                    req.flash('info', 'Password updated successfully.')
                    res.redirect('/edit_profile')
                })
            })
        });
    }

})
router.post('/update_image', auth_user, uploadImage.single('file'), (req, res) => {
    let query = { _id: req.user.id }
    let data = {}
    let path = '/passport_photos/' + req.file.filename
    let obj = req.user.files
    obj.passport_photo = path
    data.files = obj
    Employee.update(query, data, (err) => {
        req.flash('info', 'Passport photo updated successfully.')
        res.redirect('/edit_profile')
    })

})

// Authentication
router.post('/forgot_password', (req, res) => {
  const {username}=req.body;
   Employee.findOne({username:username},(err,employee)=>{
       if(employee)
       {
               var transporter = nodemailer.createTransport({
                service: 'gmail',
                host: 'smtp.gmail.com',
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.EMAIL_PASSWORD
                }
            });

            var mailOptions = {
                from: process.env.EMAIL,
                        to: username,
                        subject: 'Password Reset',
                        text: 'Your login credentials are:\n Email: '+username+'\n Password: '+employee.pass
                    };

                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            req.flash('danger', 'Server error. Please try again.')
                            console.log(error)
                            res.redirect('/forgot_password')
                        } else {
                            req.flash('info','Your password has been sent to '+username)
                            res.redirect('/forgot_password')
                        }
                    });
       }
       else
       {
           req.flash('danger',"Email doesn't exist.")
           res.redirect('/forgot_password')
       }
   })
})

router.post('/update_email',auth_user,(req,res)=>{
    let  {email} = req.body
    let query = {
        _id:req.user.id
    }
    let data =  {};
    data.username = email
    Employee.update(query,data,(err)=>{
        req.flash('info','Email updated successfully.')
        res.redirect('/edit_profile')
    })
})

router.post('/login_post', passport.authenticate('Employee', {
    successRedirect: '/leaves',
    failureRedirect: '/',
    failureFlash: true,
    session: true

}))
router.get('/log_out', auth_user, (req, res) => {
    req.logout();
    res.redirect('/')
})
module.exports = router