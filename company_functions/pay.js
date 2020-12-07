// POSTPAID -  AFTER
// PREPAID - BEFORE

const mongojs = require('mongojs')
const fs = require('fs')
var fonts = {
    Roboto: {
        normal: 'fonts/Roboto-Regular.ttf',
        bold: 'fonts/Roboto-Medium.ttf',
        italics: 'fonts/Roboto-Italic.ttf',
        bolditalics: 'fonts/Roboto-MediumItalic.ttf'
    }
};
var PdfPrinter = require('pdfmake');
var printer = new PdfPrinter(fonts);
let jsdom = require("jsdom");
let {
    JSDOM
} = jsdom;
let {
    window
} = new JSDOM("");
const htmlToPdfmake = require("html-to-pdfmake");
const db = mongojs(process.env.DATABASE, ['pays'])
var nodemailer = require("nodemailer");


// Models
const AppliedExpense = require('../models/applied_expense');
const Employee = require('../models/employee');
const EmployeeBenefit = require('../models/employee_benefit');
const EmployeeDeduct = require('../models/employee_deduction');
const EmployeeLoan = require('../models/employee_loan');
const EmployeeRelief = require('../models/employee_relief')
const Pay = require('../models/pay');
const Company = require('../models/company');
const AppliedLeave = require('../models/applied_leave')
const Expense = require('../models/expense');
const Pension = require('../models/pension')
const EmployerSummary = require('../models/employer_summary');
const EmployeeSummary = require('../models/employee_summary')

// Functions
const date = new Date();
const year = date.getFullYear();
const day = ('0' + date.getDate()).slice(-2);
const month = ('0' + (date.getMonth() + 1)).slice(-2);
const today = year + "-" + month + "-" + day;
const monthNo = date.getMonth()
const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];
const month2 = year + '-' + month

function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}


const t = {
    date: date,
    hour: addZero(date.getHours()),
    minute: addZero(date.getMinutes()),
    second: addZero(date.getSeconds()),
    year: year,
    day: day,
    month: month,
    today: today,
}

const calculate_pay = (req, res) => {
    const id = req.params.id;

    Employee.findById(id, (err, employee) => {

        if (employee.status === 'Terminated') {
            req.flash('danger', 'Current employee has been terminated')
            res.redirect('/company/view_employee/' + id)

        } else if (employee.salary_details.payment_type === '') {
            req.flash('danger', 'Kindly add payment details.')
            res.redirect('/company/view_employee/' + id)

        } else {
            EmployeeDeduct.find({
                employee_id: id,
                status: 'Active',
                company_id: req.user.company_id
            }, (err, deducts) => {
                EmployeeLoan.find({
                    employee_id: id,
                    status: 'Active',
                    company_id: req.user.company_id
                }, (err, loans) => {
                    EmployeeBenefit.find({
                        employee_id: id,
                        status: 'Active',
                        company_id: req.user.company_id
                    }, (err, benefits) => {
                        AppliedExpense.find({
                            employee_id: id,
                            status: 'Active',
                            company_id: req.user.company_id
                        }, (err, expenses) => {
                            EmployeeRelief.find({
                                employee_id: id,
                                status: 'Active',
                                company_id: req.user.company_id
                            }, (err, reliefs) => {

                                let gross_amount = parseInt(employee.salary_details.salary);
                                let pension = parseInt(employee.pension_amount);
                                let benefit = 0; // DONE
                                let pre_benefit = 0;
                                let post_benefit = 0;
                                let expense = 0; // DONE
                                let before_deductions = 0; // DONE
                                let after_deductions = 0; // DONE
                                let deductions = 0;
                                let taxable_amount = 0; // DONE
                                let income_tax = 0;
                                let relief = 0;
                                let PAYE = 0; // DONE
                                let loan = 0; // DONE
                                let net_amount = 0;
                                let tax_exemption_amount = 0;

                                // DETAILS
                                let benefit_details = []
                                let pre_benefit_details = []
                                let post_benefit_details = []
                                let expense_details = []
                                let deduction_details = []
                                let before_deduction_details = []
                                let after_deduction_details = []
                                let loan_details = []
                                let relief_details = []
                                let pension_details = []

                                // ========================  FIRST PHASE ==================================

                                // POST PAID BENEFITS
                                let car_benefit_details = {}
                                let per_diem_details = {}
                                let meal_benefit_details = {}
                                let furniture_details = {}
                                let non_cash_allowances_details = {}
                                let mobile_benefit_details = {}
                                let housing_allowance_details = {}
                                let insurance_relief_details = {}

                                benefits.map((item) => {
                                    if (item.post === 'PostPaid') {
                                        post_benefit += parseInt(item.amount)
                                        post_benefit_details.push(item)
                                    }
                                    if (item.post === 'PrePaid') {
                                        pre_benefit += parseInt(item.amount);
                                        pre_benefit_details.push(item)
                                    }
                                    if (item.type === 'Car Benefit') {
                                        car_benefit_details = item.car_benefit_details
                                    }
                                    if (item.type === 'Meal Allowance') {
                                        meal_benefit_details = item.meal_benefit_details
                                    }
                                    if (item.type === 'Per Diem') {
                                        per_diem_details = item.per_diem_details
                                    }
                                    if (item.type === 'Mobile Benefit') {
                                        mobile_benefit_details = item.mobile_benefit_details
                                    }
                                    if (item.type === 'Furniture Allowance') {
                                        furniture_details = item.furniture_details
                                    }
                                    if (item.type === 'Non Cash Allowances') {
                                        non_cash_allowances_details = item.non_cash_allowances_details
                                    }
                                    if (item.type === 'Housing Allowance') {
                                        housing_allowance_details = item.housing_allowance_details
                                    }
                                    benefit += parseInt(item.amount)
                                    benefit_details.push(item)
                                })

                                expenses.map((item) => {
                                    expense += parseInt(item.amount);
                                    expense_details.push(item)
                                })


                                let total_gross_amount = parseInt(gross_amount) + parseInt(post_benefit) + parseInt(expense)

                                // ====================== SECOND PHASE ============================================

                                // PENSION
                                let pension_array = []
                                let first_pension = parseInt(pension);
                                pension_array.push(first_pension)
                                let second_pension = parseInt(total_gross_amount) * (30 / 100);
                                pension_array.push(second_pension)

                                Pension.findOne({
                                    company_id: req.user.company_id
                                }, (err, pension) => {

                                    let obj = {
                                        employee_contribution: parseInt(gross_amount) * (pension.employee_percentage / 100),
                                        employer_contribution: parseInt(gross_amount) * (pension.employer_percentage / 100),
                                    }
                                    pension_details.push(obj)

                                })

                                pension = parseInt(first_pension);
                                // pension = parseInt(Math.min(...pension_array));
                                // DEDUCTIONS
                                deducts.map((item) => {
                                    if (item.tax === 'Before Tax') {
                                        before_deductions += item.amount;
                                        before_deduction_details.push(item)

                                    }
                                    if (item.tax === 'After Tax') {
                                        after_deductions += item.amount;
                                        after_deduction_details.push(item)
                                    }
                                    deductions += item.amount;
                                    deduction_details.push(item)
                                })

                                taxable_amount = parseInt(total_gross_amount) - (parseInt(pension) + parseInt(before_deductions))


                                // ==================== THIRD PHASE ===============================================

                                let x = parseInt(taxable_amount);

                                // GET INCOME TAX

                                if (employee.salary_details.employee_type === 'Secondary Employee') {
                                    income_tax = x * 0.25;
                                } else if (employee.salary_details.employee_type === 'Primary Employee') {
                                    if (x <= 24000) {
                                        income_tax = x * 0.1;
                                    }
                                    if (x > 24000 && x <= 40667) {
                                        income_tax = 2400 + (0.15 * (x - 24000))
                                    }
                                    if (x > 40667 && x <= 57334) {
                                        income_tax = 2400 + 2500.05 + (0.20 * (x - 40667))
                                    }
                                    if (x > 57334) {
                                        income_tax = 2400 + 2500.05 + 3333.4 + (0.25 * (x - 57334))
                                    }
                                }

                                let tax = parseInt(income_tax)

                                // =================== FOURTH PHASE ====================================================

                                reliefs.map((item) => {
                                    relief += item.amount
                                    relief_details.push(item)
                                    if (item.title === 'Insurance Relief') {
                                        insurance_relief_details = item.insurance_relief_details
                                    }
                                })

                                // TAX EXEMPTION
                                if (employee.salary_details.tax_exemption_val === true) {
                                    if (employee.salary_details.tax_exemption.approval === true) {
                                        tax_exemption_amount = parseInt(employee.salary_details.tax_exemption.disability_exemption_amount)

                                    }

                                }
                                let tax_relief = (parseInt(relief) + parseInt(tax_exemption_amount))

                                PAYE = parseInt(tax) - parseInt(tax_relief);

                                // ======================= FIFTH PHASE ===============================================

                                loans.map((item) => {
                                    loan += item.amount;
                                    loan_details.push(item)
                                })

                                let total_deductions = parseInt(PAYE) + parseInt(deductions) + parseInt(pension) + parseInt(loan) + parseInt(pre_benefit);


                                // ============================= FIFTH PHASE ===========================================

                                net_amount = parseInt(total_gross_amount) - parseInt(total_deductions)

                                Pay.findOne({
                                    employee_id: id,
                                    month: monthNames[monthNo],
                                    year: year,
                                    company_id: req.user.company_id,
                                    status: 'Pending'
                                }, (err, exist) => {
                                    if (exist) {
                                        req.flash('danger', 'Another pending payment already exists for this month.')
                                        res.redirect('/company/view_employee/' + id)
                                    } else {
                                        setTimeout(() => {
                                            function formatMoney(num) {
                                                var p = num.toFixed(2).split(".");
                                                return employee.salary_details.payment_currency + ' ' + p[0].split("").reverse().reduce(function (acc, num, i, orig) {
                                                    return num == "-" ? acc : num + (i && !(i % 3) ? "," : "") + acc;
                                                }, "") + "." + p[1];
                                            }
                                            var random = "PN-" + Math.floor(100000 + Math.random() * 900000)
                                            let data = new Pay();
                                            data.no = random;
                                            data.employee_id = id;
                                            data.employee = employee.first_name + ' ' + employee.last_name;
                                            data.emp = employee;
                                            data.company_id = req.user.company_id
                                            data.gross_amount = formatMoney(parseInt(gross_amount));
                                            data.gross_amount2 = parseInt(gross_amount)
                                            // BENEFITS
                                            data.pre_benefits = formatMoney(parseInt(pre_benefit))
                                            data.post_benefits = formatMoney(parseInt(post_benefit))
                                            data.benefit_amount = formatMoney(parseInt(benefit))
                                            data.expense_amount = formatMoney(parseInt(expense))
                                            // TOTAL GROSS AMOUNT
                                            data.total_gross_amount = formatMoney(parseInt(total_gross_amount));
                                            // DEDUCTIONS - BEFORE
                                            data.before_deductions_total = formatMoney(parseInt(before_deductions))
                                            // PENSIONS
                                            if (employee.pension === true) {
                                                data.employer_pension = formatMoney(parseInt(pension_details[0].employer_contribution))
                                                data.employee_pension = formatMoney(parseInt(pension));
                                                data.employer_pension2 = parseInt(pension_details[0].employer_contribution)
                                                data.employee_pension2 = parseInt(pension);

                                                data.pension = true;
                                                data.pension_details = pension_details

                                            } else if (employee.pension === false) {
                                                data.employer_pension = '';
                                                data.employee_pension = '';
                                                data.employer_pension2 = 0
                                                data.employee_pension2 = 0;
                                                data.pension = false;

                                                data.pension_details = []

                                            }
                                            // TAX AMOUNT
                                            data.taxable_amount = formatMoney(parseInt(taxable_amount))
                                            //INCOME TAX
                                            data.income_tax = employee.salary_details.income_tax;
                                            data.tax_amount = formatMoney(parseInt(income_tax))
                                            data.tax_amount2 = income_tax
                                            data.PAYE = formatMoney(parseInt(PAYE))
                                            data.PAYE2 = parseInt(PAYE)
                                            data.tax_exemption = employee.salary_details.tax_exemption_val;
                                            if (data.tax_exemption === true) {
                                                data.tax_exemption_amount = formatMoney(parseInt(employee.salary_details.tax_exemption.disability_exemption_amount))
                                                data.tax_certificate_number = employee.salary_details.tax_exemption.exemption_certificate_no
                                                data.tax_exemption_amount2 = parseInt(employee.salary_details.tax_exemption.disability_exemption_amount)
                                            } else if (data.tax_exemption === false) {
                                                data.tax_exemption_amount = ''
                                                data.tax_certificate_number = ''
                                                data.tax_exemption_amount2 = 0

                                            }
                                            data.relief_amount = formatMoney(parseInt(relief))
                                            // DEDUCTIONS - AFTER
                                            data.after_deductions_total = formatMoney(parseInt(after_deductions));
                                            data.deduction_amount = formatMoney(parseInt(deductions))
                                            data.loan_amount = formatMoney(parseInt(loan))
                                            // NET AMOUNT
                                            data.net_amount = formatMoney(parseInt(net_amount))
                                            data.net_amount2 = net_amount;
                                            // Details
                                            data.deduction_details = deduction_details
                                            data.loan_details = loan_details
                                            data.benefit_details = benefit_details
                                            data.expense_details = expense_details
                                            data.relief_details = relief_details
                                            data.insurance_relief_details = insurance_relief_details;
                                            data.car_benefit_details = car_benefit_details;
                                            data.per_diem_details = per_diem_details;
                                            data.meal_benefit_details = meal_benefit_details;
                                            data.furniture_details = furniture_details;
                                            data.non_cash_allowances_details = non_cash_allowances_details;
                                            data.mobile_benefit_details = mobile_benefit_details;
                                            data.housing_allowance_details = housing_allowance_details;

                                            // Payment
                                            data.payment_currency = employee.salary_details.payment_currency;
                                            data.payment_method = employee.salary_details.payment_type;
                                            const filterPayment = employee.salary_details.bank_details.filter((item) => {
                                                return item.status === 'Primary'
                                            })
                                            data.payment_details = filterPayment[0]
                                            // Date
                                            data.date = today;
                                            data.nita = 50
                                            data.month = monthNames[monthNo];
                                            data.month2 = month2;
                                            data.year = year;
                                            data.created_on = new Date();
                                            data.status = 'Pending';
                                            data.save(() => {
                                                req.flash('info', 'Monthly pay generated successfully.');
                                                res.redirect('/company/view_employee/' + id + '#payment')
                                            })

                                        }, 3000)

                                    }

                                })

                            })
                        })
                    })
                })
            })
        }

    })
}


const view_pay = (req, res) => {
    Company.findById(req.user.company_id, (err, company) => {

        if (!company.enabled) {
            req.flash('danger', 'License has expired. Please contact the administrator for renewal: Email: ' + process.env.EMAIL)
            res.redirect('/company/validate_license')
        } else {
            const id = req.params.id;
            const id2 = req.params.id2;
            Pay.findById(id2, (err, pay) => {
                Employee.findById(id, (err, employee) => {
                    Employee.find({
                        company_id: req.user.company_id
                    }, (err, employees) => {
                        AppliedLeave.find({
                            company_id: req.user.company_id,
                            status: 'Pending'
                        }, (err, leaves2) => {
                            AppliedExpense.find({
                                company_id: req.user.company_id,
                                status: 'Pending'
                            }, (err, expenses2) => {

                                res.render('./company/employee/view_pay.jade', {
                                    user: req.user,
                                    pay: pay,
                                    employee: employee,
                                    employees: employees,
                                    leaves2: leaves2,
                                    expenses2: expenses2,
                                    company: company
                                })
                            })
                        })
                    })

                })
            })
        }
    })
}

const view_pay2 = (req, res) => {
    Company.findById(req.user.company_id, (err, company) => {

        if (!company.enabled) {
            req.flash('danger', 'License has expired. Please contact the administrator for renewal: Email: ' + process.env.EMAIL)
            res.redirect('/company/validate_license')
        } else {
            const id = req.params.id;

            Pay.findById(id, (err, pay) => {
                Employee.find({
                    company_id: req.user.company_id
                }, (err, employees) => {
                    AppliedLeave.find({
                        company_id: req.user.company_id,
                        status: 'Pending'
                    }, (err, leaves2) => {
                        AppliedExpense.find({
                            company_id: req.user.company_id,
                            status: 'Pending'
                        }, (err, expenses2) => {

                            res.render('./company/employee/view_pay2.jade', {
                                user: req.user,
                                pay: pay,
                                employee: pay.emp,
                                employees: employees,
                                leaves2: leaves2,
                                expenses2: expenses2,
                                company: company
                            })
                        })
                    })
                })


            })

        }
    })

}

const view_pay3 = (req, res) => {
    Company.findById(req.user.company_id, (err, company) => {

        if (!company.enabled) {
            req.flash('danger', 'License has expired. Please contact the administrator for renewal: Email: ' + process.env.EMAIL)
            res.redirect('/company/validate_license')
        } else {
            const id = req.params.id;

            Pay.findById(id, (err, pay) => {
                Employee.find({
                    company_id: req.user.company_id
                }, (err, employees) => {
                    AppliedLeave.find({
                        company_id: req.user.company_id,
                        status: 'Pending'
                    }, (err, leaves2) => {
                        AppliedExpense.find({
                            company_id: req.user.company_id,
                            status: 'Pending'
                        }, (err, expenses2) => {

                            res.render('./company/employee/view_pay3.jade', {
                                user: req.user,
                                pay: pay,
                                employee: pay.emp,
                                employees: employees,
                                leaves2: leaves2,
                                expenses2: expenses2,
                                company: company
                            })
                        })
                    })
                })


            })
        }
    })

}

const delete_pay = (req, res) => {
    const id = req.params.id;
    const id2 = req.params.id2;
    Pay.findByIdAndRemove(id2, (err) => {
        req.flash('danger', 'Deleted successfully.')
        res.redirect('/company/view_employee/' + id)
    })

}



const bulk_pay = (req, res) => {

    let not_added = []

    Company.findById(req.user.company_id, (err, company) => {

        if (!company.enabled) {
            req.flash('danger', 'License has expired. Please contact the administrator for renewal: Email: ' + process.env.EMAIL)
            res.redirect('/company/validate_license')
        } else {
            Employee.find({
                company_id: req.user.company_id
            }, (err, employees) => {

                if (employees.length < 1) {
                    req.flash('danger', 'No active employees found.')
                    res.redirect('/company/employees')
                } else {



                    employees.map((item) => {
                        const id = item.id;

                        Employee.findById(id, (err, employee) => {

                            if (employee.status === 'Terminated') {
                                let object = {
                                    employee: employee,
                                    reason: 'Terminated.'
                                }
                                not_added.push(object)

                            } else if (employee.salary_details.payment_type === '') {
                                let object = {
                                    employee: employee,
                                    reason: 'No Payment Details Found.'
                                }
                                not_added.push(object)

                            } else if (employee.salary_details.employee_type === 'Casual Employee') {


                            } else {
                                EmployeeDeduct.find({
                                    employee_id: id,
                                    status: 'Active',
                                    company_id: req.user.company_id
                                }, (err, deducts) => {
                                    EmployeeLoan.find({
                                        employee_id: id,
                                        status: 'Active',
                                        company_id: req.user.company_id
                                    }, (err, loans) => {
                                        EmployeeBenefit.find({
                                            employee_id: id,
                                            status: 'Active',
                                            company_id: req.user.company_id
                                        }, (err, benefits) => {
                                            AppliedExpense.find({
                                                employee_id: id,
                                                status: 'Active',
                                                company_id: req.user.company_id
                                            }, (err, expenses) => {
                                                EmployeeRelief.find({
                                                    employee_id: id,
                                                    status: 'Active',
                                                    company_id: req.user.company_id
                                                }, (err, reliefs) => {
                                                    let gross_amount = parseInt(employee.salary_details.salary);
                                                    let pension = parseInt(employee.pension_amount);
                                                    let benefit = 0; // DONE
                                                    let pre_benefit = 0;
                                                    let post_benefit = 0;
                                                    let expense = 0; // DONE
                                                    let before_deductions = 0; // DONE
                                                    let after_deductions = 0; // DONE
                                                    let deductions = 0;
                                                    let taxable_amount = 0; // DONE
                                                    let income_tax = 0;
                                                    let relief = 0;
                                                    let PAYE = 0; // DONE
                                                    let loan = 0; // DONE
                                                    let net_amount = 0;
                                                    let tax_exemption_amount = 0;

                                                    // DETAILS
                                                    let benefit_details = []
                                                    let pre_benefit_details = []
                                                    let post_benefit_details = []
                                                    let expense_details = []
                                                    let deduction_details = []
                                                    let before_deduction_details = []
                                                    let after_deduction_details = []
                                                    let loan_details = []
                                                    let relief_details = []
                                                    let pension_details = []
                                                    // Benefits 
                                                    let car_benefit_details = {}
                                                    let per_diem_details = {}
                                                    let meal_benefit_details = {}
                                                    let furniture_details = {}
                                                    let non_cash_allowances_details = {}
                                                    let mobile_benefit_details = {}
                                                    let housing_allowance_details = {}
                                                    let insurance_relief_details = {}



                                                    // ========================  FIRST PHASE ==================================

                                                    // POST PAID BENEFITS

                                                    benefits.map((item2) => {
                                                        if (item2.post === 'PostPaid') {
                                                            post_benefit += parseInt(item2.amount)
                                                            post_benefit_details.push(item2)
                                                        }
                                                        if (item2.post === 'PrePaid') {
                                                            pre_benefit += parseInt(item2.amount);
                                                            pre_benefit_details.push(item2)
                                                        }
                                                        benefit += parseInt(item2.amount)
                                                        benefit_details.push(item2)
                                                        if (item2.type === 'Car Benefit') {
                                                            car_benefit_details = item2.car_benefit_details
                                                        }
                                                        if (item2.type === 'Meal Allowance') {
                                                            meal_benefit_details = item2.meal_benefit_details
                                                        }
                                                        if (item2.type === 'Per Diem') {
                                                            per_diem_details = item2.per_diem_details
                                                        }
                                                        if (item2.type === 'Mobile Benefit') {
                                                            mobile_benefit_details = item2.mobile_benefit_details
                                                        }
                                                        if (item2.type === 'Furniture Allowance') {
                                                            furniture_details = item2.furniture_details
                                                        }
                                                        if (item2.type === 'Non Cash Allowances') {
                                                            non_cash_allowances_details = item2.non_cash_allowances_details
                                                        }
                                                        if (item2.type === 'Housing Allowance') {
                                                            housing_allowance_details = item2.housing_allowance_details
                                                        }
                                                    })

                                                    expenses.map((item2) => {
                                                        expense += parseInt(item2.amount);
                                                        expense_details.push(item2)
                                                    })


                                                    let total_gross_amount = parseInt(gross_amount) + parseInt(post_benefit) + parseInt(expense)

                                                    // ====================== SECOND PHASE ============================================

                                                    // PENSION
                                                    let pension_array = []
                                                    let first_pension = parseInt(pension);
                                                    pension_array.push(first_pension)
                                                    let second_pension = parseInt(total_gross_amount) * (30 / 100);
                                                    pension_array.push(second_pension)

                                                    Pension.findOne({
                                                        company_id: req.user.company_id
                                                    }, (err, pension) => {

                                                        let obj = {
                                                            employee_contribution: parseInt(gross_amount) * (pension.employee_percentage / 100),
                                                            employer_contribution: parseInt(gross_amount) * (pension.employer_percentage / 100),
                                                        }
                                                        pension_details.push(obj)

                                                    })

                                                    pension = parseInt(first_pension);
                                                    // pension = parseInt(Math.min(...pension_array));
                                                    // DEDUCTIONS
                                                    deducts.map((item2) => {
                                                        if (item2.tax === 'Before Tax') {
                                                            before_deductions += item2.amount;
                                                            before_deduction_details.push(item2)

                                                        }
                                                        if (item2.tax === 'After Tax') {
                                                            after_deductions += item2.amount;
                                                            after_deduction_details.push(item2)
                                                        }
                                                        deductions += item2.amount;
                                                        deduction_details.push(item2)
                                                    })

                                                    taxable_amount = parseInt(total_gross_amount) - (parseInt(pension) + parseInt(before_deductions))


                                                    // ==================== THIRD PHASE ===============================================

                                                    let x = parseInt(taxable_amount);

                                                    // GET INCOME TAX

                                                    if (employee.salary_details.employee_type === 'Secondary Employee') {
                                                        income_tax = x * 0.25;
                                                    } else if (employee.salary_details.employee_type === 'Primary Employee') {
                                                        if (x <= 24000) {
                                                            income_tax = x * 0.1;
                                                        }
                                                        if (x > 24000 && x <= 40667) {
                                                            income_tax = 2400 + (0.15 * (x - 24000))
                                                        }
                                                        if (x > 40667 && x <= 57334) {
                                                            income_tax = 2400 + 2500.05 + (0.20 * (x - 40667))
                                                        }
                                                        if (x > 57334) {
                                                            income_tax = 2400 + 2500.05 + 3333.4 + (0.25 * (x - 57334))
                                                        }
                                                    }

                                                    let tax = parseInt(income_tax)

                                                    // =================== FOURTH PHASE ====================================================

                                                    reliefs.map((item2) => {
                                                        relief += item2.amount
                                                        relief_details.push(item2)
                                                        if (item2.title === 'Insurance Relief') {
                                                            insurance_relief_details = item2.insurance_relief_details
                                                        }
                                                    })

                                                    // TAX EXEMPTION
                                                    if (employee.salary_details.tax_exemption_val === true) {
                                                        if (employee.salary_details.tax_exemption.approval === true) {
                                                            tax_exemption_amount = parseInt(employee.salary_details.tax_exemption.disability_exemption_amount)

                                                        }

                                                    }
                                                    let tax_relief = (parseInt(relief) + parseInt(tax_exemption_amount))

                                                    PAYE = parseInt(tax) - parseInt(tax_relief);

                                                    // ======================= FIFTH PHASE ===============================================

                                                    loans.map((item2) => {
                                                        loan += item2.amount;
                                                        loan_details.push(item2)
                                                    })

                                                    let total_deductions = parseInt(PAYE) + parseInt(deductions) + parseInt(pension) + parseInt(loan) + parseInt(pre_benefit);


                                                    // ============================= FIFTH PHASE ===========================================

                                                    net_amount = parseInt(total_gross_amount) - parseInt(total_deductions)

                                                    Pay.findOne({
                                                        employee_id: id,
                                                        month: monthNames[monthNo],
                                                        year: year,
                                                        company_id: req.user.company_id,
                                                        status: 'Pending'
                                                    }, (err, exist) => {
                                                        if (exist) {

                                                        } else {
                                                            setTimeout(() => {
                                                                function formatMoney(num) {
                                                                    var p = num.toFixed(2).split(".");
                                                                    return employee.salary_details.payment_currency + ' ' + p[0].split("").reverse().reduce(function (acc, num, i, orig) {
                                                                        return num == "-" ? acc : num + (i && !(i % 3) ? "," : "") + acc;
                                                                    }, "") + "." + p[1];
                                                                }
                                                                var random = "PN-" + Math.floor(100000 + Math.random() * 900000)
                                                                let data = new Pay();
                                                                data.no = random;
                                                                data.employee_id = id;
                                                                data.employee = employee.first_name + ' ' + employee.last_name;
                                                                data.emp = employee;
                                                                data.company_id = req.user.company_id
                                                                data.gross_amount = formatMoney(parseInt(gross_amount));
                                                                data.gross_amount2 = parseInt(gross_amount)
                                                                // BENEFITS
                                                                data.pre_benefits = formatMoney(parseInt(pre_benefit))
                                                                data.post_benefits = formatMoney(parseInt(post_benefit))
                                                                data.benefit_amount = formatMoney(parseInt(benefit))
                                                                data.expense_amount = formatMoney(parseInt(expense))
                                                                // TOTAL GROSS AMOUNT
                                                                data.total_gross_amount = formatMoney(parseInt(total_gross_amount));
                                                                // DEDUCTIONS - BEFORE
                                                                data.before_deductions_total = formatMoney(parseInt(before_deductions))
                                                                // PENSIONS
                                                                if (employee.pension === true) {
                                                                    data.employer_pension = formatMoney(parseInt(pension_details[0].employer_contribution))
                                                                    data.employee_pension = formatMoney(parseInt(pension));
                                                                    data.employer_pension2 = parseInt(pension_details[0].employer_contribution)
                                                                    data.employee_pension2 = parseInt(pension);

                                                                    data.pension = true;
                                                                    data.pension_details = pension_details

                                                                } else if (employee.pension === false) {
                                                                    data.employer_pension = '';
                                                                    data.employee_pension = '';
                                                                    data.employer_pension2 = 0
                                                                    data.employee_pension2 = 0;
                                                                    data.pension = false;

                                                                    data.pension_details = []

                                                                }
                                                                // TAX AMOUNT
                                                                data.taxable_amount = formatMoney(parseInt(taxable_amount))
                                                                //INCOME TAX
                                                                data.income_tax = employee.salary_details.income_tax;
                                                                data.tax_amount = formatMoney(parseInt(income_tax))
                                                                data.tax_amount2 = income_tax
                                                                data.PAYE = formatMoney(parseInt(PAYE))
                                                                data.PAYE2 = parseInt(PAYE)
                                                                data.tax_exemption = employee.salary_details.tax_exemption_val;
                                                                if (data.tax_exemption === true) {
                                                                    data.tax_exemption_amount = formatMoney(parseInt(employee.salary_details.tax_exemption.disability_exemption_amount))
                                                                    data.tax_exemption_amount2 = parseInt(employee.salary_details.tax_exemption.disability_exemption_amount)
                                                                    data.tax_certificate_number = employee.salary_details.tax_exemption.exemption_certificate_no

                                                                } else if (data.tax_exemption === false) {
                                                                    data.tax_exemption_amount = ''
                                                                    data.tax_certificate_number = ''
                                                                    data.tax_exemption_amount2 = 0

                                                                }
                                                                data.relief_amount = formatMoney(parseInt(relief))
                                                                // DEDUCTIONS - AFTER
                                                                data.after_deductions_total = formatMoney(parseInt(after_deductions));
                                                                data.deduction_amount = formatMoney(parseInt(deductions))
                                                                data.loan_amount = formatMoney(parseInt(loan))
                                                                // NET AMOUNT
                                                                data.net_amount = formatMoney(parseInt(net_amount))
                                                                data.net_amount2 = net_amount;
                                                                // Details
                                                                data.deduction_details = deduction_details
                                                                data.loan_details = loan_details
                                                                data.benefit_details = benefit_details
                                                                data.expense_details = expense_details
                                                                data.relief_details = relief_details

                                                                // Payment
                                                                data.payment_currency = employee.salary_details.payment_currency;
                                                                data.payment_method = employee.salary_details.payment_type;
                                                                const filterPayment = employee.salary_details.bank_details.filter((item) => {
                                                                    return item.status === 'Primary'
                                                                })
                                                                data.payment_details = filterPayment[0]

                                                                data.insurance_relief_details = insurance_relief_details;
                                                                data.car_benefit_details = car_benefit_details;
                                                                data.per_diem_details = per_diem_details;
                                                                data.meal_benefit_details = meal_benefit_details;
                                                                data.furniture_details = furniture_details;
                                                                data.non_cash_allowances_details = non_cash_allowances_details;
                                                                data.mobile_benefit_details = mobile_benefit_details;
                                                                data.housing_allowance_details = housing_allowance_details;

                                                                // Date
                                                                data.date = today;
                                                                data.nita = 50
                                                                data.month = monthNames[monthNo];
                                                                data.month2 = month2;
                                                                data.year = year;
                                                                data.created_on = new Date();
                                                                data.status = 'Pending';
                                                                data.save(() => {

                                                                })

                                                            }, 5000)

                                                        }
                                                    })

                                                })
                                            })
                                        })
                                    })
                                })
                            }

                        })

                    })
   

                    setTimeout(() => {
                        Pay.find({
                            month: monthNames[monthNo],
                            year: year,
                            status: 'Pending',
                            company_id: req.user.company_id
                        }, (err, pays) => {
                           
                            EmployeeSummary.findOne({
                                company_id: req.user.company_id,
                                month2: month2,
                                no:1
                            }, (err, summary) => {
                                 // Employers Summary
                                 EmployerSummary.findOne({
                                    company_id: req.user.company_id,
                                    month2: month2,
                                  
                                    no:1
                                }, (err, summary2) => {

                                    let employer_summary = {
                                        NITA: 0,
                                        NHIF: 0,
                                        NSSF: 0,
                                        PENSION: 0,
                                        PAYE: 0,
                                        net_pay: 0,
                                        gross_pay: 0,
                                        month: monthNames[monthNo],
                                        year: year,
                                    }
        
                                    let employee_summary = {
                                        deductions: 0,
                                        benefits: 0,
                                        expenses: 0,
                                        loans: 0,
                                        relief: 0,
                                        pensions: 0,
                                        tax_exemption: 0,
                                        PAYE: 0,
                                        net_amount: 0,
                                        gross_amount: 0,
                                        month: monthNames[monthNo],
                                        year: year,
                                    }


                            pays.map((item) => {
                                item.deduction_details.map((item) => {
                                    employee_summary.deductions += item.amount
                                })
                                item.benefit_details.map((item) => {
                                    employee_summary.benefits += item.amount
                                })
                                item.expense_details.map((item) => {
                                    employee_summary.expenses += item.amount
                                })
                                item.loan_details.map((item) => {
                                    employee_summary.loans += item.amount
                                })
                                item.relief_details.map((item) => {
                                    employee_summary.relief += item.amount
                                })
                                employee_summary.pensions += item.employee_pension2
                                employee_summary.tax_exemption += item.tax_exemption_amount2
                                employee_summary.PAYE += item.PAYE2
                                employee_summary.net_amount += item.net_amount2
                                employee_summary.gross_amount += item.gross_amount2

                                item.deduction_details.map((item) => {
                                    if (item.type === 'NHIF') {
                                        employer_summary.NHIF += item.amount
                                    }
                                    if (item.type === 'NSSF') {
                                        employer_summary.NSSF += item.amount
                                    }
                                })
                                if (item.emp.nita === true) {
                                    employer_summary.NITA += 50
                                }
                                employer_summary.PENSION += item.employee_pension2
                                employer_summary.PAYE += item.PAYE2
                                employer_summary.net_pay += item.net_amount2
                                employer_summary.gross_pay += item.gross_amount2

                                setTimeout(() => {
                                    // Employees
                                  
                                        if (summary) {
                                            let filterNo = summary.pay_no.filter((item2) => {
                                                return item2 === item.no
                                            })

                                            if (filterNo.length < 1) {
                                                let query = {
                                                    _id: summary.id
                                                }
                                                let data = {}
                                                data.deductions = parseInt(employee_summary.deductions)
                                                data.benefits = parseInt(employee_summary.benefits)
                                                data.expenses = parseInt(employee_summary.expenses)
                                                data.loans = parseInt(employee_summary.loans)
                                                data.pensions = parseInt(employee_summary.pensions)
                                                data.tax_exemption = parseInt(employee_summary.tax_exemption)
                                                data.relief = parseInt(employee_summary.relief)
                                                data.PAYE = parseInt(employee_summary.PAYE)
                                                data.net_pay = parseInt(employee_summary.net_amount)
                                                data.gross_pay = parseInt(employee_summary.gross_amount)
                                                data.pay_no = summary.pay_no.concat([item.no])
                                                EmployeeSummary.update(query, data, () => {

                                                })
                                            }


                                        } else  {
                                            let data = new EmployeeSummary({
                                                no:1,
                                                company_id: req.user.company_id,
                                                deductions: parseInt(employee_summary.deductions),
                                                benefits: parseInt(employee_summary.benefits),
                                                expenses: parseInt(employee_summary.expenses),
                                                loans: parseInt(employee_summary.loans),
                                                pensions: parseInt(employee_summary.pensions),
                                                tax_exemption: parseInt(employee_summary.tax_exemption),
                                                relief: parseInt(employee_summary.relief),
                                                PAYE: parseInt(employee_summary.PAYE),
                                                net_pay: parseInt(employee_summary.net_amount),
                                                gross_pay: parseInt(employee_summary.gross_amount),
                                                approved: false,
                                                month: monthNames[monthNo],
                                                month2: month2,
                                                pay_no: [item.no],
                                                year: parseInt(year),
                                            });
                                            data.save((err, result) => {


                                            })

                                        }


                                        if (summary2) {
                                            let filterNo = summary.pay_no.filter((item2) => {
                                                return item2 === item.no
                                            })
                                            if (filterNo.length < 1) {
                                                let query = {
                                                    _id: summary2.id
                                                }
                                                let data = {}
                                                data.NITA = parseInt(employer_summary.NITA)
                                                data.PENSION = parseInt(employer_summary.PENSION)
                                                data.NHIF = parseInt(employer_summary.NHIF)
                                                data.NSSF = parseInt(employer_summary.NSSF)
                                                data.PAYE = parseInt(employer_summary.PAYE)
                                                data.net_pay = parseInt(employer_summary.net_pay)
                                                data.gross_pay = parseInt(employer_summary.gross_pay)
                                                data.pay_no = summary2.pay_no.concat([item.no])
                                                EmployerSummary.update(query, data, (err) => {

                                                })
                                            }


                                        } else  {
                                            let data = new EmployerSummary({
                                                no:1,
                                                company_id: req.user.company_id,
                                                NITA: parseInt(employer_summary.NITA),
                                                NHIF: parseInt(employer_summary.NHIF),
                                                NSSF: parseInt(employer_summary.NSSF),
                                                PENSION: parseInt(employer_summary.PENSION),
                                                PAYE: parseInt(employer_summary.PAYE),
                                                net_pay: parseInt(employer_summary.net_pay),
                                                gross_pay: parseInt(employer_summary.gross_pay),
                                                approved: false,
                                                pay_no: [item.no],
                                                month: monthNames[monthNo],
                                                month2: month2,
                                                year: parseInt(year),
                                            });
                                            data.save(() => {

                                            })

                                        }


                                  

                                },2500)

                            })
                        })
                    })


                        })

                    }, 7000)

                    setTimeout(() => {

                        Pay.find({
                            month: monthNames[monthNo],
                            year: year,
                            status: 'Pending',
                            company_id: req.user.company_id
                        }, (err, pays) => {
                            EmployerSummary.findOne({
                                company_id: req.user.company_id,
                                month: monthNames[monthNo],
                                year: year,

                            }, (err, employer_summary) => {
                                EmployeeSummary.findOne({
                                    company_id: req.user.company_id,
                                    month: monthNames[monthNo],
                                    year: year,

                                }, (err, employee_summary) => {

                                    console.log(employer_summary)
                                    console.log(employee_summary)


                                    const net_pay = []
                                    pays.map((item) => {
                                        net_pay.push(parseInt(item.net_amount2))
                                    })

                                    const tax_pay = []
                                    pays.map((item) => {
                                        tax_pay.push(parseInt(item.PAYE2))
                                    })
                                    const total_net_pay = net_pay.reduce((a, b) => a + b, 0)
                                    const total_tax_pay = tax_pay.reduce((a, b) => a + b, 0)
                                    let check = 0;
                                    if (employee_summary.approved === true) {
                                        check += 1
                                    }
                                    if (employer_summary.approved === true) {
                                        check += 1
                                    }

                                    Employee.find({
                                        company_id: req.user.company_id
                                    }, (err, employees) => {
                                        AppliedLeave.find({
                                            company_id: req.user.company_id,
                                            status: 'Pending'
                                        }, (err, leaves2) => {
                                            AppliedExpense.find({
                                                company_id: req.user.company_id,
                                                status: 'Pending'
                                            }, (err, expenses2) => {

                                                var formatter = new Intl.NumberFormat('en-US', {
                                                    style: 'currency',
                                                    currency: company.currency,


                                                });
                                                if (total_tax_pay === 0 || total_net_pay === 0) {
                                                    res.render("./company/employee/bulk.jade", {
                                                        user: req.user,
                                                        tax_pay: formatter.format(total_tax_pay),
                                                        net_pay: formatter.format(total_net_pay),
                                                        month: monthNames[monthNo],
                                                        year: year,
                                                        pays: pays,
                                                        employees: employees,
                                                        company: company,
                                                        leaves2: leaves2,
                                                        expenses2: expenses2,
                                                        not_added: not_added,
                                                        none: true,
                                                        check: check

                                                    })
                                                } else {
                                                    res.render("./company/employee/bulk.jade", {
                                                        user: req.user,
                                                        tax_pay: formatter.format(total_tax_pay),
                                                        net_pay: formatter.format(total_net_pay),
                                                        month: monthNames[monthNo],
                                                        year: year,
                                                        pays: pays,
                                                        employees: employees,
                                                        company: company,
                                                        leaves2: leaves2,
                                                        employee_summary: employee_summary,
                                                        employer_summary: employer_summary,
                                                        expenses2: expenses2,
                                                        not_added: not_added,
                                                        none: false,
                                                        check: check

                                                    })
                                                }

                                            })
                                        })
                                    })

                                })
                            })
                        })

                    }, 13000)
                }
            })
        }
    })
}

const approve_employee = (req, res) => {

    EmployeeSummary.findOne({
        company_id: req.user.company_id,
        month2: month2,
        approved: false

    }, (err, summary) => {
        let query = {
            _id: summary.id
        }
        let data = {};
        data.approved = true
        EmployeeSummary.update(query, data, () => {
            req.flash('info', 'Approved successfully.')
            res.redirect('/company/bulk_pay')
        })

    })


}
const approve_employer = (req, res) => {
    EmployerSummary.findOne({
        company_id: req.user.company_id,
        month: monthNames[monthNo],
        year: year,
        approved: false

    }, (err, summary) => {
        let query = {
            _id: summary.id
        }
        let data = {};
        data.approved = true
        EmployerSummary.update(query, data, () => {
            req.flash('info', 'Approved successfully.')
            res.redirect('/company/bulk_pay')

        })

    })
}

const delete_all = (req, res) => {
    Pay.remove({
        year: req.params.year,
        month: req.params.month,
        status: 'Pending',
        company_id: req.user.company_id
    }, (err) => {
        EmployerSummary.remove({
            company_id: req.user.company_id,
            month: monthNames[monthNo],
            year: year,

        }, (err) => {
            EmployeeSummary.remove({
                company_id: req.user.company_id,
                month: monthNames[monthNo],
                year: year,

            }, (err) => {
                req.flash('danger', monthNames[monthNo] + ' payments deleted successfully.');
                res.redirect('/company/employees')
            })
        })

    })

}

const confirm_all = (req, res) => {
    Pay.find({
        month: req.params.month,
        year: req.params.year,
        company_id: req.user.company_id,
        status: 'Pending'
    }, (err, pays) => {
        Company.findById(req.user.company_id, (err, company) => {


            pays.map((item2) => {
                let query = {
                    _id: item2.id
                }
                let data = {};
                data.status = 'Confirmed';
                Pay.update(query, data, (err) => {
                    AppliedExpense.find({
                        employee_id: item2.emp.id,
                        status: 'Active',
                        company_id: req.user.company_id
                    }, (err, expenses) => {
                        expenses.map((item) => {
                            let query = {
                                _id: item.id
                            }
                            let data = {}
                            data.status = 'Paid'
                            AppliedExpense.update(query, data, (err) => {


                            })
                        })
                    })

                    // GENERATE PDF


                })

            })
        })
    })
    var no = 0
    setTimeout(() => {


        setInterval(() => {
            Pay.find({
                month: req.params.month,
                year: req.params.year,
                company_id: req.user.company_id,
                status: 'Confirmed'
            }, (err, pays) => {
                pays.map((item) => {
                    // Create pdf
                    const before_deduction = item.deduction_details.map((deduct) => {
                        if (deduct.tax === 'Before Tax') {
                            return `<tr>
                        <td colspan=3>${deduct.type}: ${item.emp.salary_details.payment_currency} -${deduct.amount}</td>
                        </tr>
                        `
                        }

                    })
                    const after_deduction = item.deduction_details.map((deduct) => {

                        return `<tr>
                        <td colspan=3>${deduct.type}: ${item.emp.salary_details.payment_currency} -${deduct.amount}</td>
                        </tr>
                        `


                    })
                    const relief = item.relief_details.map((relief) => {
                        return `<tr>
                        <td colspan=3>
                         ${relief.title}: ${item.payment_currency} ${relief.amount}
                        </td>
                        </tr>
                        `

                    })

                    const before_benefit = item.benefit_details.map((benefit) => {

                        if (benefit.post === 'PostPaid') {
                            return `
                            <tr>
                             <td colspan=3> ${benefit.type}: ${item.payment_currency} ${benefit.amount} </td>
                            
                             </tr>
                            `
                        }
                    })

                    const after_benefit = item.benefit_details.map((benefit) => {

                        if (benefit.post === 'PrePaid') {
                            return `
                        <tr>
                         <td colspan=3> ${benefit.type}: ${item.payment_currency} ${benefit.amount} </td>
                         
                         </tr>
                        `
                        }
                    })
                    const expense = item.expense_details.map((expense) => {
                        return `
                            <tr>
                            <td colspan=3> ${expense.type}: ${item.payment_currency} ${expense.amount} </td>
                            </tr>
                         `
                    })
                    const loan = item.loan_details.map((loan) => {
                        return `
                            <tr>
                            <td colspan=3> ${loan.type}: -${item.payment_currency} ${loan.amount} </td>
                            </tr>
                         `
                    })

                    var html = `<table class='table' id="tblCustomers" style='border: 1px solid black' cellspacing="0" rules="all" border="1">
        <tbody>
        <tr>
         <td>  </td>
         <td> </td>
         <td> <h4 style='font-weight:bold;text-decoration:underline'> No: ${item.no}</h4></td>
        </tr>
        <tr>
         <td> 
          <h6 style='font-weight:bold;text-decoration:underline'>Employee Details</h6>
          <p>Employee Name: ${item.emp.first_name} ${item.emp.middle_name} ${item.emp.last_name} </p>
          <p>Employee Email: ${item.emp.username}</p>
          <p>Job Number: ${item.emp.hr_details.job_number}</p>
          <p>Job Title: ${item.emp.hr_details.job_title}</p>
          <p>Department: ${item.emp.hr_details.department}</p>
         
         </td>
         <td> 
          <h6 style='font-weight:bold;text-decoration:underline'>Salary Details</h6>
          <p>${item.month}, ${item.year} </p>
          <p>Date: ${item.date}</p>
          <p>Tax: ${item.income_tax}</p>
          <p>Gross Pay: ${item.gross_amount}</p>
          <p>Net Pay: ${item.net_amount}</p>
          <p>Tax Pay:  ${item.tax_amount}</p>
          ${item.tax_exemption === true ?

                            `<p>Tax Exemption Amount: ${item.tax_exemption_amount} </p>
                                <p>Tax Exemption Certificate: ${item.tax_certificate_number} </p>`

                            :
                            `<p></p>`

                        }
           <p>Status: ${item.status === 'Pending' ?
                            `<span style='background:black;color:white;padding:4px;border-radius:3px'>${item.status}</span>`
                            :
                            `<span style='background:green;color:white;padding:4px;border-radius:3px'>${item.status}</span>`

                        }  </p>
         </td>
         <td>
         <h6 style='font-weight:bold;text-decoration:underline'>Payment Details</h6>
          <p>Payment method: ${item.payment_method} </p>
          <p>Currency: ${item.payment_currency}</p>
          ${item.payment_method === 'Mobile Money' ?
                            `
            <p>Mobile Network: ${item.payment_details.mobile_network}</p>
            <p> Mobile Number: ${item.payment_details.mobile_number}</p>
            `
                            :
                            `
              <p>Bank Account Name: ${item.payment_details.bank_account_name} </p>
              <p>Bank Account Number: ${item.payment_details.bank_account_no}</p>
              <p>Bank Name: ${item.payment_details.bank_name}</p>
              <p>Bank Branch: ${item.payment_details.bank_branch}</p>
              <p>Bank Branch Code: ${item.payment_details.bank_branch_code}</p>
              `
                        }

         </td>
        </tr>

        <tr>
            <td colspan=3>
             <p style='font-weight:bold'>Basic Pay: ${item.gross_amount} </p>
            </td>
        </tr>

        <tr>
             <td colspan=3> 
             <p style='font-weight:300;text-decoration:underline'>Post Benefits</p>
             </td>
        </tr>
        ${item.benefit_details.length > 0 ?
                            `${before_benefit}`
                            :
                            `
                            <tr>
                                <td colspan=3>
                                <span> No benefits found.</span>
                                </td>
                            </tr>
                             `
                        }

        <tr>
             <td colspan=3> 
             <p style='font-weight:300;text-decoration:underline'>Expenses</p>
             </td>
        </tr>
        ${item.expense_details.length > 0 ?
                            `${expense}`
                            :
                            `
                            <tr>
                            <td colspan=3>
                            <span> No expenses found.</span>
                            </td>
                                </tr>
                            `
                        }
        <tr>
        <td colspan=3> 
        <p style='font-weight:bold'>Total Gross pay: ${item.total_gross_amount}
        </p>
        </td>
        </tr>

        <tr>
        <td colspan=3> 
             <p style='font-weight:300;text-decoration:underline'>Deductions</p>
        </td>
        </tr>

        ${item.deduction_details.length > 0 ?
                            `${before_deduction}`
                            :
                            `
            <tr>
                <td colspan=3> <span>No deductions found.</span> </td>
            </tr>
           
            `
                        }
         ${item.pension === true ?
                            `<tr> 
                <td colspan=3>Pension: -${item.employee_pension} </td>
                </tr>`
                            :
                            ``
                        }


        <tr>
         <td colspan=3>
         <p style='font-weight:bold'>Taxable Amount: ${item.taxable_amount} </p>
         </td>
        </tr>
        
        <tr>
         <td colspan=3>
         <p style='font-weight:bold'>Income Tax: ${item.tax_amount} </p>
         </td>
        </tr>

        <tr>
            <td colspan=3>
            <p style='font-weight:300;text-decoration:underline'>Tax Exemption </p>
            </td>
        </tr>

         ${item.tax_exemption === false ?
                            `
            <tr>
            <td colspan=3>
             <span>No tax exemption found.</span>
            </td>
            </tr>
            `
                            :
                            `
            <tr>
            <td colspan=3>
             ${item.tax_exemption_amount}  </td>
            </tr>
            `
                        }

        <tr>
            <td colspan=3>
            <p style='font-weight:300;text-decoration:underline'>Relief </p>
            </td>
        </tr>
        ${item.relief_details.length < 1 ?
                            `
            <tr>
            <td colspan=3>
             <span>No reliefs found.</span>
            </td>
            </tr>
            `
                            :
                            `
            ${relief}
            `
                        }
        <tr>
        <td colspan=3> 
        <p style='font-weight:bold'>PAYE: ${item.PAYE}</p>
        </td>
        </tr>

        <tr>
        <td colspan=3> 
        <p style='font-weight:bold'>Total Gross pay: ${item.total_gross_amount}
        </p>
        </td>
        </tr>

        <tr>
        <td colspan=3> 
             <p style='font-weight:300;text-decoration:underline'>Deductions</p>
        </td>
        </tr>

        ${item.deduction_details.length > 0 ?
                            `${after_deduction}`
                            :
                            `
            <tr>
                <td colspan=3> <span>No deductions found.</span> </td>
            </tr>
           

            `
                        }
        ${item.pension === true ?
                            `<tr> 
                <td colspan=3>Pension: -${item.employee_pension} </td>
                </tr>`


                            :
                            ``
                        }
                        <tr>
                        <td colspan=3> 
                        <p style='font-weight:300;text-decoration:underline'>Loans</p>
                        </td>
                   </tr>
                   ${item.loan_details.length > 0 ?
                            `${loan}`
                            :
                            `
    <tr>
        <td colspan=3> <span>No loans found.</span> </td>
    </tr>
   

    `
                        }
        <tr>
        <td colspan=3> 
        <p style='font-weight:300;text-decoration:underline'>Pre Benefits</p>
        </td>
   </tr>
   ${item.benefit_details.length > 0 ?
                            `${after_benefit}`
                            :
                            `
       <tr>
                   <td colspan=3>
                   <span> No benefits found.</span>
                   </td>
               </tr>
       `
                        }

               <tr>
               <td colspan=3> 
               <p style='font-weight:bold'>NET AMOUNT: ${item.net_amount}</p>
               </td>
                    </tr>
       
             





        </tbody>
        </table>
        `
                    // let obj = {
                    //     no: item.no,
                    //     htm: html
                    // }
                    // array.push(obj)

                    dd = {
                        userPassword: item.emp.id_number,
                        ownerPassword: item.emp.id_number,
                        permissions: {
                            printing: 'highResolution', //'lowResolution'
                            modifying: false,
                            copying: false,
                            annotating: true,
                            fillingForms: true,
                            contentAccessibility: true,
                            documentAssembly: true
                        },
                        pageSize: "A4",
                        pageOrientation: "portrait",
                        content: htmlToPdfmake(html, {
                            window: window
                        }),
                        defaultStyle: {
                            fontSize: 8,

                        }
                    }

                    var options = {
                        // ...
                    }
                    if (no < pays.length) {
                        no += 1
                        var pdfDoc = printer.createPdfKitDocument(dd, options);
                        pdfDoc.pipe(fs.createWriteStream('./uploads/pdfs/' + item.no + '.pdf'));
                        pdfDoc.end()
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
                            to: item.emp.username,
                            subject: 'PAYROLL SLIP FOR ' + monthNames[monthNo] + ', ' + year,
                            text: 'Hi ' + item.employee + ', Kindly find your payroll slip for current month. The file is password protected. Kindly use your registered ID Number as your password to access the file. Thank you.',
                            attachments: [{
                                filename: item.no + '.pdf',
                                path: './uploads/pdfs/' + item.no + '.pdf',
                                cid: 'PAYROLL SLIP'
                            }]

                        };

                        transporter.sendMail(mailOptions, function (error, info) {
                            if (error) {

                            } else {
                                fs.unlinkSync('./uploads/pdfs/' + item.no + '.pdf')

                            }
                        });

                    }







                })
            })
        }, 6000)


    }, 5000)


    setTimeout(() => {

        res.redirect('/company/reports')
    }, 15000)
}



module.exports = {
    calculate_pay: calculate_pay,
    delete_pay: delete_pay,
    view_pay: view_pay,
    view_pay2: view_pay2,
    view_pay3: view_pay3,
    approve_employee: approve_employee,
    approve_employer: approve_employer,

    bulk_pay: bulk_pay,
    delete_all: delete_all,
    confirm_all: confirm_all
}