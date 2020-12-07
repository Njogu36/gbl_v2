// LIBRARIES


// IMPORTED FUNCTIONS


// MODELS
const Employee = require('../models/employee')
const Job = require('../models/job_title')
const Department = require('../models/department')
const Region = require('../models/region')
const Shift = require('../models/work_shift')
const Subsidiary = require('../models/subsidiary')
const Admin = require('../models/adminCompany')
const Deduct = require('../models/deduction')
const Benefit = require('../models/benefit')
const Loan = require('../models/loan')
const Bank = require('../models/bank')
const Leave = require('../models/leave');
const Expense = require('../models/expense')
const Company = require('../models/company')
const Relief = require('../models/relief')
const Rate = require('../models/rate')
const Pension = require('../models/pension')
const AppliedLeave = require('../models/applied_leave');
const AppliedExpense = require('../models/applied_expense')
const CCRating = require('../models/cc_rating')
const HouseAllowance = require('../models/house_allowance')


// FUNCTIONS
const settings_page = (req, res) => {
    Company.findById(req.user.company_id, (err, company) => {

        if (!company.enabled) {
            req.flash('danger', 'License has expired. Please contact the administrator for renewal: Email: ' + process.env.EMAIL)
            res.redirect('/company/validate_license')
        }
        else {



            if (company.country === 'Kenya') {


                // NHHF
                Deduct.findOne({ code: 'A100', title: 'NHIF', company_id: req.user.company_id }, (err, deduction) => {
                    if (deduction) {

                    }
                    else if (!deduction) {
                        let data = new Deduct();
                        data.title = 'NHIF';
                        data.code = 'A100';
                        data.rate = true;
                        data.type = 'After Tax'
                        data.company_id = req.user.company_id
                        data.status = 'Active';
                        data.save(() => {

                        })
                    }
                })



                // NSSF
                Deduct.findOne({ code: 'A102', title: 'NSSF', company_id: req.user.company_id }, (err, deduction) => {
                    if (deduction) {

                    }
                    else if (!deduction) {
                        let data = new Deduct();
                        data.title = 'NSSF';
                        data.code = 'A102';
                        data.rate = false;
                        data.type = 'Before Tax'
                        data.company_id = req.user.company_id
                        data.status = 'Active';
                        data.save(() => {

                        })
                    }
                })

                // RELIEF
                // - PERSONAL
                Relief.findOne({ item: 'Personal Relief', company_id: req.user.company_id }, (err, relief) => {
                    if (relief) {

                    }
                    else {
                        let data = new Relief();
                        data.item = 'Personal Relief',
                        data.company_id = req.user.company_id,
                        data.amount = 2400
                        data.percentage = false
                        data.maximum_amount = 28800;
                        data.maximum_mode = 'Per Annum'
          
                        data.save(() => {

                        })

                    }

                })

                Relief.findOne({ item: 'Mortgage Relief', company_id: req.user.company_id }, (err, relief) => {
                    if (relief) {

                    }
                    else {
                        let data = new Relief();
                        data.item = 'Mortgage Relief',
                            data.company_id = req.user.company_id,
                            data.amount = null
                        data.maximum_amount = 25000;
                        data.maximum_mode = 'Per Month'
          
                        data.save(() => {

                        })

                    }

                })

                Relief.findOne({ item: 'Insurance Relief', company_id: req.user.company_id }, (err, relief) => {
                    if (relief) {

                    }
                    else {
                        let data = new Relief();
                        data.item = 'Insurance Relief',
                        data.company_id = req.user.company_id,
                        data.amount = 15
                        data.percentage = true
                        data.maximum_amount = 60000;
                        data.maximum_mode = 'Per Annum'
                        data.save(() => {

                        })

                    }

                })

                // Pension
                Pension.findOne({ company_id: req.user.company_id }, (err, pension) => {
                    if (pension) {

                    }
                    else {
                        let data = new Pension();
                        data.employee_percentage = 0;
                        data.employer_percentage = 0;
                        data.maximum_amount = 20000
                        data.company_id = req.user.company_id;
                        data.save(() => {

                        })
                    }
                })





                // - LIFE INSURANCE

                // Car Benefit
                Benefit.findOne({ title: 'Car Benefit', company_id: req.user.company_id }, (err, benefit) => {
                    if (benefit) {

                    }
                    else {
                        let data = new Benefit({
                            title: 'Car Benefit',
                            company_id: req.user.company_id,
                            value: 2,
                            percentage: true,
                            code: 'A100',
                            status: 'Active'
                        })
                        data.save(() => {

                        })

                    }

                })

                // Meal Allowance
                Benefit.findOne({ title: 'Meal Allowance', company_id: req.user.company_id }, (err, meal) => {
                    if (meal) {

                    }
                    else {
                        let data = new Benefit({
                            title: 'Meal Allowance',
                            value: 4000,
                            percentage: false,
                            company_id: req.user.company_id,
                            code: 'A101',
                            status: 'Active'
                        })
                        data.save(() => {

                        })

                    }

                })

                // Per Diem
                Benefit.findOne({ title: 'Per Diem', company_id: req.user.company_id }, (err, diem) => {
                    if (diem) {

                    }
                    else {
                        let data = new Benefit({
                            title: 'Per Diem',
                            value: 2000,
                            percentage: false,
                            company_id: req.user.company_id,
                            code: 'A102',
                            status: 'Active'
                        })
                        data.save(() => {

                        })

                    }

                })

                // House Allowance
                Benefit.findOne({ title: 'House Allowance', company_id: req.user.company_id }, (err, house) => {
                    if (house) {

                    }
                    else {
                        let data = new Benefit({
                            title: 'House Allowance',
                            taxable: 'True',
                            value: Number,
                            company_id: String,
                            code: String,
                            status: String
                        })

                    }

                })

                // Mobile Benefit
                Benefit.findOne({ title: 'Mobile Benefit', company_id: req.user.company_id }, (err, mobile) => {
                    if (mobile) {

                    }
                    else {
                        let data = new Benefit({
                            title: 'Mobile Benefit',
                            value: 30,
                            percentage: true,
                            company_id: req.user.company_id,
                            code: 'A103',
                            status: 'Active'
                        })
                        data.save(() => {

                        })

                    }

                })

                // Furniture Allowances
                Benefit.findOne({ title: 'Furniture Allowance', company_id: req.user.company_id }, (err, furniture) => {
                    if (furniture) {

                    }
                    else {
                        let data = new Benefit({
                            title: 'Furniture Allowance',
                            value: 1,
                            percentage: true,
                            company_id: req.user.company_id,
                            code: 'A104',
                            status: 'Active'
                        })
                        data.save(() => {

                        })

                    }

                })

                // Non Cash Allowances
                Benefit.findOne({ title: 'Non Cash Allowances', company_id: req.user.company_id }, (err, noncash) => {
                    if (noncash) {

                    }
                    else {
                        let data = new Benefit({
                            title: 'Non Cash Allowances',

                            value: 3000,
                            percentage: false,

                            company_id: req.user.company_id,
                            code: 'A105',
                            status: 'Active'
                        })
                        data.save(() => {

                        })

                    }

                })

                Benefit.findOne({ title: 'Housing Allowance', company_id: req.user.company_id }, (err, house) => {
                    if (house) {

                    }
                    else {
                        let data = new Benefit({
                            title: 'Housing Allowance',


                            company_id: req.user.company_id,
                            code: 'A106',
                            status: 'Active'
                        })
                        data.save(() => {

                        })

                    }

                })

            }

            Employee.find({ company_id: req.user.company_id }, (err, employees) => {
                Job.find({ company_id: req.user.company_id }, (err, job_titles) => {
                    Department.find({ company_id: req.user.company_id }, (err, departments) => {
                        Region.find({ company_id: req.user.company_id }, (err, regions) => {
                            Shift.find({ company_id: req.user.company_id }, (err, shifts) => {
                                Subsidiary.find({ company_id: req.user.company_id }, (err, companies) => {
                                    Admin.find({ company_id: req.user.company_id }, (err, admins) => {
                                        Deduct.find({ company_id: req.user.company_id }, (err, deductions) => {
                                            Benefit.find({ company_id: req.user.company_id }, (err, benefits) => {
                                                Loan.find({ company_id: req.user.company_id }, (err, loans) => {
                                                    Bank.find({ company_id: req.user.company_id }, (err, banks) => {
                                                        Expense.find({ company_id: req.user.company_id }, (err, expenses) => {
                                                            Leave.find({ company_id: req.user.company_id }, (err, leaves) => {
                                                                Relief.find({ company_id: req.user.company_id }, (err, reliefs) => {
                                                                    Pension.findOne({ company_id: req.user.company_id }, (err, pension) => {
                                                                        AppliedLeave.find({ company_id: req.user.company_id, status: 'Pending' }, (err, leaves2) => {
                                                                            AppliedExpense.find({ company_id: req.user.company_id, status: 'Pending' }, (err, expenses2) => {
                                                                                Company.findById(req.user.company_id, (err, company) => {
                                                                                    setTimeout(() => {
                                                                                        res.render('./company/settings/setting.jade', {
                                                                                            user: req.user,
                                                                                            employees: employees,
                                                                                            job_titles: job_titles,
                                                                                            departments: departments,
                                                                                            regions: regions,
                                                                                            shifts: shifts,
                                                                                            company: company,
                                                                                            companies: companies,
                                                                                            reliefs: reliefs,
                                                                                            admins: admins,
                                                                                            deductions: deductions,
                                                                                            expenses2: expenses2,
                                                                                            benefits: benefits,
                                                                                            loans: loans,
                                                                                            banks: banks,
                                                                                            leaves: leaves,
                                                                                            leaves2: leaves2,
                                                                                            expenses: expenses,
                                                                                            pension: pension,
                                                                                            company: company
                                                                                        })
                                                                                    }, 3000)
                                                                                })

                                                                            })
                                                                        })
                                                                    })

                                                                })
                                                            })
                                                        })

                                                    })

                                                })


                                            })

                                        })

                                    })

                                })

                            })

                        })

                    })

                })

            })

        }
    })

}

const view_rates = (req, res) => {
    Deduct.findById(req.params.id, (err, deduct) => {
        Company.findById(req.user.company_id, (err, company) => {
            Employee.find({ company_id: req.user.company_id }, (err, employees) => {
                Rate.find({ company_id: req.user.company_id, deduct_id: req.params.id }, (err, rates) => {
                    AppliedLeave.find({ company_id: req.user.company_id, status: 'Pending' }, (err, leaves2) => {
                        AppliedExpense.find({ company_id: req.user.company_id, status: 'Pending' }, (err, expenses2) => {

                            res.render('./company/settings/view_rates.jade', {
                                user: req.user,
                                deduct: deduct,
                                employees: employees,
                                company: company,
                                leaves2: leaves2,
                                expenses2: expenses2,
                                rates: rates
                            })
                        })
                    })
                })

            })
        })

    })
}

const add_new_rate = (req, res) => {
    const { amount, maximum_amount, minimum_amount } = req.body;

    Rate.findOne({ minimum_amount: minimum_amount, amount: amount, deduct_id: req.params.id, maximum_amount: maximum_amount, company_id: req.user.company_id }, (err, rate) => {
        if (rate) {
            req.flash('danger', 'Rate already exists.');
            res.redirect('/company/view_rates/' + req.params.id)
        }
        else if (!rate) {


            let data = new Rate();
            data.deduct_id = req.params.id

            data.minimum_amount = minimum_amount
            data.maximum_amount = maximum_amount
            data.amount = amount

            data.company_id = req.user.company_id

            data.save(() => {
                req.flash('info', 'Rate added successfully.');
                res.redirect('/company/view_rates/' + req.params.id)
            })

        }
    })

}

const get_rate_details = (req, res) => {
    const id = req.params.id;
    Rate.findById(id, (err, rate) => {
        res.send({ success: true, rate: rate })
    })
}

const edit_rate_details = (req, res) => {
    const { id, amount, maximum_amount, minimum_amount } = req.body;
    const id2 = req.params.id

    let query = {
        _id: id
    }
    let data = {};
    data.minimum_amount = minimum_amount
    data.maximum_amount = maximum_amount
    data.amount = amount


    Rate.update(query, data, () => {
        req.flash('info', 'Relief updated successfully.');
        res.redirect('/company/view_rates/' + id2)
    })


}
const delete_rate = (req, res) => {
    const id = req.params.id
    const id2 = req.params.id2
    Rate.findByIdAndRemove(id2, () => {
        req.flash('danger', 'Relief deleted successfully.');
        res.redirect('/company/view_rates/' + id)
    })

}

const edit_pension_details = (req, res) => {
    const { employee, employer, amount } = req.body
    const id = req.params.id;
    let query = {
        _id: id
    }
    let data = {};
    data.employee_percentage = employee;
    data.employer_percentage = employer;
    data.maximum_amount = amount
    Pension.update(query, data, (err) => {
        req.flash('info', 'Pension details updated successfully.');
        res.redirect('/company/settings')
    })

}


// CC Ratings
const cc_rating = (req, res) => {
    Deduct.findById(req.params.id, (err, deduct) => {
        Company.findById(req.user.company_id, (err, company) => {
            Employee.find({ company_id: req.user.company_id }, (err, employees) => {
                AppliedLeave.find({ company_id: req.user.company_id, status: 'Pending' }, (err, leaves2) => {
                    AppliedExpense.find({ company_id: req.user.company_id, status: 'Pending' }, (err, expenses2) => {
                        CCRating.find({ company_id: req.user.company_id }, (err, rates) => {
                            Benefit.findById(req.params.id, (err, benefit) => {
                                res.render('./company/settings/cc_ratings.jade', {
                                    user: req.user,
                                    deduct: deduct,
                                    employees: employees,
                                    company: company,
                                    leaves2: leaves2,
                                    expenses2: expenses2,
                                    rates: rates,
                                    benefit: benefit
                                })
                            })

                        })
                    })
                })

            })
        })

    })

}

const cc_rating_post = (req, res) => {
    const { cubic_centimetres, amount } = req.body
    CCRating.findOne({ cubic_centimetres: cubic_centimetres, company_id: req.user.company_id }, (err, rate) => {
        if (rate) {
            req.flash('danger', 'Rate already exists.')
            res.redirect('/company/cc_ratings/' + req.params.id)
        }
        else {
            let data = new CCRating()
            data.amount = amount;
            data.company_id = req.user.company_id;
            data.cubic_centimetres = cubic_centimetres;
            data.save(() => {
                req.flash('info', 'Rate saved successfully.')
                res.redirect('/company/cc_ratings/' + req.params.id)
            })
        }
    })
}
const edit_cc_rating_post = (req, res) => {
    const { id, cubic_centimetres, amount } = req.body

    let query = {
        _id: id
    }
    let data = {}
    data.amount = amount;
    data.company_id = req.user.company_id;
    data.cubic_centimetres = cubic_centimetres;
    CCRating.update(query, data, (err) => {
        req.flash('info', 'Rate updated successfully.')
        res.redirect('/company/cc_ratings/' + req.params.id)
    })

}

const delete_cc_rating = (req, res) => {
    const id = req.params.id
    const id2 = req.params.id2
    CCRating.findByIdAndRemove(id2, (err) => {
        req.flash('danger', 'Rate deleted successfully.')
        res.redirect('/company/cc_ratings/' + id)
    })
}

const get_cc_rate_details = (req, res) => {
    CCRating.findById(req.params.id, (err, rate) => {
        res.send({ success: true, rate: rate })
    })

}

const house_allowance = (req, res) => {
    Company.findById(req.user.company_id, (err, company) => {
        Employee.find({ company_id: req.user.company_id }, (err, employees) => {
            AppliedLeave.find({ company_id: req.user.company_id, status: 'Pending' }, (err, leaves2) => {
                AppliedExpense.find({ company_id: req.user.company_id, status: 'Pending' }, (err, expenses2) => {
                    CCRating.find({ company_id: req.user.company_id }, (err, rates) => {
                        Benefit.findById(req.params.id, (err, benefit) => {
                            HouseAllowance.find({ company_id: req.user.company_id }, (err, houses) => {
                                res.render('./company/settings/house_allowance.jade', {
                                    user: req.user,
                                    houses: houses,
                                    employees: employees,
                                    company: company,
                                    leaves2: leaves2,
                                    expenses2: expenses2,
                                    rates: rates,
                                    benefit: benefit
                                })
                            })

                        })

                    })
                })
            })

        })
    })



}

const delete_house_allowance = (req, res) => {
    const id = req.params.id;
    const id2 = req.params.id2;
    HouseAllowance.findByIdAndRemove(id2, (err) => {
        req.flash('danger', 'Rate deleted successfully.')
        res.redirect('/company/house_allowance/' + id)
    })
}

const house_allowance_post = (req, res) => {
    const { type, value } = req.body
    const id = req.params.id
    HouseAllowance.findOne({ type: type, company_id: req.user.company_id }, (err, house) => {
        if (house) {
            req.flash('danger', 'Rate already exists.')
            res.redirect('/company/house_allowance/' + id)
        }
        else {
            let data = new HouseAllowance();
            data.type = type;
            data.value = value;
            data.company_id = req.user.company_id;
            data.save(() => {
                req.flash('info', 'Rate added successfully.')
                res.redirect('/company/house_allowance/' + id)
            })
        }
    })
}

const edit_house_allowance_post = (req, res) => {
    const { id, value } = req.body
    const id2 = req.params.id
    let query = {
        _id: id
    }
    let data = {}
    data.value = value;
    HouseAllowance.update(query, data, () => {
        req.flash('info', 'Rate updated successfully.')
        res.redirect('/company/house_allowance/' + id2)
    })

}

const get_house_allowance_details = (req, res) => {
    const id = req.params.id;
    HouseAllowance.findById(id, (err, rate) => {
        res.send({ success: true, rate: rate })
    })
}

// MODULE EXPORTED
module.exports = {
    edit_house_allowance_post: edit_house_allowance_post,
    get_house_allowance_details: get_house_allowance_details,
    settings_page: settings_page,
    view_rates: view_rates,
    add_new_rate: add_new_rate,
    get_rate_details: get_rate_details,
    edit_rate_details: edit_rate_details,
    delete_rate: delete_rate,
    edit_pension_details: edit_pension_details,
    cc_rating: cc_rating,
    cc_rating_post: cc_rating_post,
    edit_cc_rating_post: edit_cc_rating_post,
    delete_cc_rating: delete_cc_rating,
    get_cc_rate_details: get_cc_rate_details,
    house_allowance: house_allowance,
    house_allowance_post: house_allowance_post,
    delete_house_allowance: delete_house_allowance

}