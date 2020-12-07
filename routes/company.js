// LIBRARIES
const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');



// IMPORTED FUNCTIONS
const auth = require('../company_functions/admin_authentication');
const license = require('../company_functions/license');
const employee = require('../company_functions/employees');
const leave = require('../company_functions/leave');
const payroll = require('../company_functions/payroll');
const reports = require('../company_functions/reports');
const settings = require('../company_functions/settings');
const expense = require('../company_functions/expense')

// others
const deduct = require('../company_functions/deduct');
const loan = require('../company_functions/loan');
const bank = require('../company_functions/bank')
const company = require('../company_functions/company')
const benefit = require('../company_functions/benefit')
const admin = require('../company_functions/users')
const hrm_settings = require('../company_functions/hrm_settings');
const expense_setting = require('../company_functions/expense_setting')
const leave_setting = require('../company_functions/leave_setting')
const pay = require('../company_functions/pay')
const relief = require('../company_functions/relief')
const casual = require('../company_functions/casual')

// modals
const License = require('../models/license');
const Company = require('../models/company');
const { authenticate } = require('passport');

// INTERNAL FUNCTIONS
const auth_user = (req, res, next) => {
    if (!req.user) {
        req.flash('info', 'You are logged out. Please login again.')
        res.redirect('/company')
    }
    else {
      
       next()
       
    }
}



var storageFile = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === 'certificate') {
            cb(null, './uploads/certificates')
        }
        else if (file.fieldname === 'resume_letter') {
            cb(null, './uploads/resume_letters')
        }
        else if (file.fieldname === 'cover_letter') {
            cb(null, './uploads/cover_letters')
        }
        else if (file.fieldname === 'passport_photo') {
            cb(null, './uploads/passport_photos')
        }
    },
    filename: (req, file, cb) => {
        if (file.fieldname === 'certificate') {
            cb(null, file.fieldname + Date.now() + path.extname(file.originalname));
        }
        else if (file.fieldname === 'resume_letter') {
            cb(null, file.fieldname + Date.now() + path.extname(file.originalname));
        }
        else if (file.fieldname === 'cover_letter') {
            cb(null, file.fieldname + Date.now() + path.extname(file.originalname));
        }
        else if (file.fieldname === 'passport_photo') {
            cb(null, file.fieldname + Date.now() + path.extname(file.originalname));
        }
    }
})

var upload = multer({ storage: storageFile })



// ROUTES

// login page
router.get('/', auth.login_page);
router.post('/login_post', auth.login_post);
router.get('/log_out', auth_user, auth.log_out)


// ACCOUNT

// validate_license
router.get('/validate_license', auth_user, license.license_page)
router.post('/validate_license',auth_user,license.validate_license)

// employees page
router.get('/employees', auth_user, employee.employee_page)
router.get('/add_new_employee', auth_user, employee.add_new_employee)
router.get('/view_employee/:id',auth_user,employee.view_employee)
router.get('/delete_employee/:id',auth_user,employee.delete_employee)
router.get('/delete_deduct/:id/:id2',auth_user,employee.delete_deduct);
router.get('/delete_loan/:id/:id2',auth_user,employee.delete_loan)
router.get('/delete_benefit/:id/:id2',auth_user,employee.delete_benefit)
router.get('/activate_loan/:id/:id2',auth_user,employee.activate_loan)
router.get('/activate_deduct/:id/:id2',auth_user,employee.activate_deduct)
router.get('/activate_benefit/:id/:id2',auth_user,employee.activate_benefit)
router.get('/deactivate_loan/:id/:id2',auth_user,employee.deactivate_loan)
router.get('/deactivate_deduct/:id/:id2',auth_user,employee.deactivate_deduct)
router.get('/deactivate_benefit/:id/:id2',auth_user,employee.deactivate_benefit)
router.get('/activate_employee/:id',auth_user,employee.activate_employee);
router.get('/terminate_employee/:id',auth_user,employee.terminate_employee)
router.get('/accept_expense/:id/:id2',auth_user,employee.activate_expense)
router.get('/decline_expense/:id/:id2',auth_user,employee.decline_expense)
router.get('/activate_relief/:id/:id2',auth_user,employee.activate_relief)
router.get('/deactivate_relief/:id/:id2',auth_user,employee.deactivate_relief)
router.get('/delete_relief/:id/:id2',auth_user,employee.delete_relief)
router.get('/delete_payment/:id/:no',auth_user,employee.delete_payment)
router.get('/make_primary/:id/:no',auth_user,employee.make_primary)
router.get('/get_pension/:no',auth_user,employee.get_pension)


router.post('/add_employee_relief/:id',auth_user,employee.add_employee_relief)
router.post('/edit_employee_salary/:id',auth_user,employee.edit_employee_salary)

router.post('/suspension/:id',auth_user,employee.suspension)
router.get('/accept_exemption/:id',auth_user,employee.accept_exemption)
router.get('/decline_exemption/:id',auth_user,employee.decline_exemption)
router.get('/edit_employee/:id',auth_user,employee.edit_employee)
router.get('/bulk_pay',auth_user,pay.bulk_pay)
router.post('/add_mobile_details/:id',auth_user,employee.add_mobile_details)
router.post('/add_bank_details/:id',auth_user,employee.add_bank_details)
router.post('/add_new_employee', upload.fields([{
    name: 'certificate', maxCount: 1
}, {
    name: 'resume_letter', maxCount: 1
},
{
    name: 'cover_letter', maxCount: 1
},
{
    name: 'passport_photo', maxCount: 1
}]), auth_user, employee.add_new_employee_post)

router.post('/edit_employee/:id', upload.fields([{
    name: 'certificate', maxCount: 1
}, {
    name: 'resume_letter', maxCount: 1
},
{
    name: 'cover_letter', maxCount: 1
},
{
    name: 'passport_photo', maxCount: 1
}]), auth_user, employee.edit_employee_post)

router.post('/add_employee_deduction/:id',auth_user,employee.add_employee_deduction)
router.post('/add_employee_loan/:id',auth_user,employee.add_employee_loan)
router.post('/add_employee_benefit/:id',auth_user,employee.add_employee_benefit)

//casual
router.get('/casuals',auth_user,casual.casual_page)
router.get('/mid_month',auth_user,casual.mid_month)
router.get('/end_month',auth_user,casual.end_month)
router.get('/casual_erase/:id',auth_user,casual.casual_erase)
router.get('/get_department/:id',auth_user,casual.get_department)
router.get('/get_week/:no',auth_user,casual.get_week)
router.get('/get_comments/:id',auth_user,casual.get_comments)
router.post('/edit_settings',auth_user,casual.edit_settings)
router.post('/add_today_pay/:id',auth_user,casual.add_today_pay)
router.post('/casual_departments/',auth_user,casual.casual_departments)

// leave page
router.get('/leaves', auth_user, leave.leave_page)
router.get('/get_leave_details2/:id', auth_user, leave.get_leave_details)
router.post('/accept_leave',auth_user,leave.accept_leave);
router.post('/decline_leave',auth_user,leave.decline_leave)

// expenses
router.get('/expenses',auth_user,expense.expense_page)
router.get('/accept_expense/:id',auth_user,expense.activate_expense)
router.get('/decline_expense/:id',auth_user,expense.decline_expense)

// payroll page
router.get('/payroll', auth_user, payroll.payroll_page)

// reports page
router.get('/reports', auth_user, reports.report_page)
router.get('/nhif_report',auth_user,reports.nhif_report)
router.get('/nssf_report',auth_user,reports.nssf_report)
router.get('/kra_report',auth_user,reports.kra_report)
router.get("/employees_report",auth_user,reports.employees_report)
router.get("/employers_report",auth_user,reports.employers_report)

router.post('/nhif_month',auth_user,reports.nhif_month)
router.post('/nssf_month',auth_user,reports.nssf_month)
router.post('/employers_month',auth_user,reports.employers_month)
router.post('/employee_month',auth_user,reports.employee_month)
router.post('/kra_month',auth_user,reports.kra_month)
// settings page
router.get('/settings', auth_user, settings.settings_page)
router.get('/view_rates/:id',auth_user,settings.view_rates)
router.get('/cc_ratings/:id',auth_user,settings.cc_rating)
router.get('/get_cc_rate_details/:id',auth_user,settings.get_cc_rate_details)
router.get('/delete_cc_rating/:id/:id2',auth_user,settings.delete_cc_rating)
router.get('/house_allowance/:id',auth_user,settings.house_allowance)
router.get('/delete_house_allowance/:id/:id2',auth_user,settings.delete_house_allowance)
//rates
router.get('/get_house_allowance_details/:id',auth_user,settings.get_house_allowance_details)
router.get('/get_rate_details/:id', auth_user, settings.get_rate_details)
router.get('/delete_rate/:id/:id2', auth_user, settings.delete_rate)
router.post('/edit_house_allowance_post/:id',auth_user,settings.edit_house_allowance_post)
router.post('/house_allowance_post/:id',auth_user,settings.house_allowance_post)
router.post('/cc_rating_post/:id',auth_user,settings.cc_rating_post)
router.post('/edit_cc_rating_post/:id',auth_user,settings.edit_cc_rating_post)
router.post('/add_new_rate/:id', auth_user, settings.add_new_rate)
router.post('/edit_rate_details/:id', auth_user,settings.edit_rate_details)
router.post('/edit_pension_details/:id',auth_user,settings.edit_pension_details)

// Others

// Pay
router.get('/calculate_pay/:id',auth_user,pay.calculate_pay)
router.get('/delete_pay/:id/:id2',auth_user,pay.delete_pay)
router.get('/view_pay/:id/:id2',auth_user,pay.view_pay)
router.get('/view_pay2/:id',auth_user,pay.view_pay2)
router.get('/view_pay3/:id',auth_user,pay.view_pay3)
router.get('/delete_all/:month/:year',auth_user,pay.delete_all)
router.get('/confirm_all/:month/:year',auth_user,pay.confirm_all)
router.get('/approve_employee',auth_user,pay.approve_employee)
router.get('/approve_employer',auth_user,pay.approve_employer)

//router.get('/send_email/:id/:id2',auth_user,pay.send_email)

// job title
router.get('/get_job_title/:id', auth_user, hrm_settings.get_job_title)
router.get('/delete_job_title/:id', auth_user, hrm_settings.delete_job_title)
router.post('/add_new_job_title', auth_user, hrm_settings.add_new_job_title)
router.post('/edit_job_title/', auth_user, hrm_settings.edit_job_title)

// department title
router.get('/get_department_title/:id', auth_user, hrm_settings.get_department_title)
router.get('/delete_department_title/:id', auth_user, hrm_settings.delete_department_title)
router.post('/add_new_department_title', auth_user, hrm_settings.add_new_department_title)
router.post('/edit_department_title/', auth_user, hrm_settings.edit_department_title)

// region title
router.get('/delete_region_title/:id', auth_user, hrm_settings.delete_region_title);
router.get('/get_region_title/:id', auth_user, hrm_settings.get_region_title)
router.post('/add_new_region_title/', auth_user, hrm_settings.add_new_region_title);
router.post('/edit_region_title', auth_user, hrm_settings.edit_region_title)

// work shift

router.get('/delete_shift_title/:id', auth_user, hrm_settings.delete_shift_title);
router.get('/get_shift_data/:id', auth_user, hrm_settings.get_shift_data)
router.post('/add_new_work_shift', auth_user, hrm_settings.add_new_work_shift);
router.post('/edit_work_shift', auth_user, hrm_settings.edit_work_shift)

// company
router.get('/get_company_details/:id', auth_user, company.get_company_details)
router.get('/delete_company/:id', auth_user, company.delete_company)
router.post('/add_new_company', auth_user, company.add_new_company);
router.post('/edit_company_details', auth_user, company.edit_company_details)


// admin
router.get('/get_admin_details/:id', auth_user, admin.get_admin_details)
router.get('/delete_admin/:id', auth_user, admin.delete_admin)
router.post('/add_new_administrator', auth_user, admin.add_new_admin);
router.post('/edit_admin_details', auth_user, admin.edit_admin_details)
router.post('/edit_admin_password', auth_user, admin.edit_admin_password)

// deduct
router.get('/get_deduct_details/:id', auth_user, deduct.get_deduct_details)
router.get('/delete_deduct/:id', auth_user, deduct.delete_deduct)
router.post('/add_new_deduct', auth_user, deduct.add_new_deduct);
router.post('/edit_deduct_details', auth_user, deduct.edit_deduct_details)

// benefit
router.get('/get_benefit_details/:id', auth_user, benefit.get_benefit_details)
router.get('/delete_benefit/:id', auth_user, benefit.delete_benefit)
router.post('/add_new_benefit', auth_user, benefit.add_new_benefit);
router.post('/edit_benefit_details', auth_user, benefit.edit_benefit_details)

// loan
router.get('/get_loan_details/:id', auth_user, loan.get_loan_details)
router.get('/delete_loan/:id', auth_user, loan.delete_loan)
router.post('/add_new_loan', auth_user, loan.add_new_loan);
router.post('/edit_loan_details', auth_user, loan.edit_loan_details)

// bank
router.get('/get_bank_details/:id', auth_user, bank.get_bank_details)
router.get('/delete_bank/:id', auth_user, bank.delete_bank)
router.post('/add_new_bank', auth_user, bank.add_new_bank);
router.post('/edit_bank_details', auth_user, bank.edit_bank_details)


// expenses
router.get('/get_expense_details/:id', auth_user,expense_setting.get_expense_details)
router.get('/delete_expense/:id', auth_user, expense_setting.delete_expense)
router.post('/add_new_expense', auth_user, expense_setting.add_new_expense);
router.post('/edit_expense_details', auth_user, expense_setting.edit_expense_details)


// leaves
router.get('/get_leave_details/:id', auth_user, leave_setting.get_leave_details)
router.get('/delete_leave/:id', auth_user, leave_setting.delete_leave)
router.post('/add_new_leave', auth_user, leave_setting.add_new_leave);
router.post('/edit_leave_details', auth_user, leave_setting.edit_leave_details)


// relief
router.get('/get_relief_details/:id', auth_user, relief.get_relief_details)
router.get('/delete_relief/:id', auth_user, relief.delete_relief)
router.post('/add_new_relief', auth_user, relief.add_new_relief);
router.post('/edit_relief_details', auth_user, relief.edit_relief_details)




module.exports = router;