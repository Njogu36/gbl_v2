// LIBRARIES
const bcrypt = require('bcryptjs')
var nodemailer = require('nodemailer');
const fs = require('fs')

// MODELS
const Employee = require('../models/employee')
const Job = require('../models/job_title')
const Department = require('../models/department')
const Region = require('../models/region')
const Shift = require('../models/work_shift')
const Subsidiary = require('../models/subsidiary')
const Bank = require('../models/bank')
const AppliedExpense = require('../models/applied_expense')
const AppliedLeave = require('../models/applied_leave')
const Deduction = require('../models/deduction');
const Loan = require('../models/loan')
const Benefit = require('../models/benefit')
const EmployeeDeduct = require('../models/employee_deduction');
const EmployeeBenefit = require('../models/employee_benefit');
const EmployeeLoan = require('../models/employee_loan')
const EmployeeRelief = require('../models/employee_relief')
const Pay = require('../models/pay')
const Company = require('../models/company')
const Currency = require('../models/currency')
const Relief = require('../models/relief')
const Casual = require('../models/casual')
const Pension = require('../models/pension')
const CasualSetting = require('../models/casual_setting')
const CCRating = require('../models/cc_rating')
const HouseAllowance = require('../models/house_allowance')
//
const date = require('../company_functions/date');
const EmployeeDeduction = require('../models/employee_deduction');
const Deduct = require('../models/deduction');
const Rate = require('../models/rate')
const Attendance = require('../models/attendance')

const dat = new Date();
const year = dat.getFullYear();
const day = ('0' + dat.getDate()).slice(-2);
const day3 = dat.getDate();

const month = ('0' + (dat.getMonth() + 1)).slice(-2);
const today = year + "-" + month + "-" + day;

const monthNo = date.date.getMonth()
const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

// FUNCTIONS
const employee_page = (req, res) => {

    Company.findById(req.user.company_id, (err, company) => {

        if (!company.enabled) {
            req.flash('danger', 'License has expired. Please contact the administrator for renewal: Email: ' + process.env.EMAIL)
            res.redirect('/company/validate_license')
        }
        else {
            Employee.find({ company_id: req.user.company_id }, (err, employees) => {
                Employee.find({ manager: true, company_id: req.user.company_id }, (err, managers) => {
                    Job.find({ company_id: req.user.company_id }, (err, jobs) => {
                        Department.find({ company_id: req.user.company_id }, (err, departments) => {
                            Region.find({ company_id: req.user.company_id }, (err, regions) => {
                                Shift.find({ company_id: req.user.company_id }, (err, shifts) => {
                                    Company.find({ company_id: req.user.company_id }, (err, companies) => {
                                        Pay.find({ month: monthNames[monthNo], status: 'Pending', company_id: req.user.company_id }, (err, pays) => {
                                            AppliedLeave.find({ company_id: req.user.company_id, status: 'Pending' }, (err, leaves2) => {
                                                AppliedExpense.find({ company_id: req.user.company_id, status: 'Pending' }, (err, expenses2) => {

                                                    res.render('./company/employee/employee.jade', {
                                                        user: req.user,
                                                        employees: employees,
                                                        jobs: jobs,
                                                        departments: departments,
                                                        regions: regions,
                                                        shifts: shifts,
                                                        companies: companies,
                                                        leaves2: leaves2,
                                                        expenses2: expenses2,
                                                        company: company,
                                                        managers: managers,
                                                        month: monthNames[monthNo],
                                                        pays: pays
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


            }).sort({ _id: -1 })
        }
    })

}

const add_new_employee = (req, res) => {
    Company.findById(req.user.company_id, (err, company) => {

        if (!company.enabled) {
            req.flash('danger', 'License has expired. Please contact the administrator for renewal: Email: ' + process.env.EMAIL)
            res.redirect('/company/validate_license')
        }
        else {
            Employee.find({ company_id: req.user.company_id }, (err, employees) => {
                Job.find({ company_id: req.user.company_id }, (err, jobs) => {
                    Employee.find({ manager: true, company_id: req.user.company_id }, (err, managers) => {
                        Department.find({ company_id: req.user.company_id }, (err, departments) => {
                            Region.find({ company_id: req.user.company_id }, (err, regions) => {
                                Shift.find({ company_id: req.user.company_id }, (err, shifts) => {
                                    Subsidiary.find({ company_id: req.user.company_id }, (err, companies) => {
                                        Bank.find({}, (err, banks) => {
                                            Currency.find({}, (err, currencies) => {
                                                AppliedLeave.find({ company_id: req.user.company_id, status: 'Pending' }, (err, leaves2) => {
                                                    AppliedExpense.find({ company_id: req.user.company_id, status: 'Pending' }, (err, expenses2) => {

                                                        console.log(currencies)
                                                        res.render('./company/employee/add_employee.jade', {
                                                            user: req.user,
                                                            employees: employees,
                                                            jobs: jobs,
                                                            departments: departments,
                                                            regions: regions,
                                                            shifts: shifts,
                                                            leaves2: leaves2,
                                                            expenses2: expenses2,
                                                            company: company,
                                                            companies: companies,
                                                            banks: banks,
                                                            managers: managers,
                                                            currencies: currencies
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

const add_new_employee_post = (req, res) => {

    const random = Math.floor(1000 + Math.random() * 9000)

    const { first_name, middle_name, last_name, pension_amount, gender, dob, id_number,nita_checkbox, kra_pin, nssf_no, nhif_no, resident, employee_type, salary, work_shift, off_days, income_tax, nhif_checkbox, nssf_checkbox, pension, disability_exemption_amount, exemption_certificate_no, job_number, job_title, date_of_employment, subsidiary, department, head_of_department, reports_to, region, contract_start_date, contract_end_date, contract_duration, university, level_of_education, gpa, course, official_email, personal_email, country, mobile_phone_no, official_phone_no, city, county, address, zip_code, next_of_kin_fullname, next_of_kin_relation, next_of_kin_phone, next_of_kin_email, next_of_kin_fullname2, next_of_kin_relation2, next_of_kin_phone2, next_of_kin_email2, linkedin, twitter, login_email, } = req.body
    Company.findById(req.user.company_id, (err, company) => {


        Employee.findOne({ first_name: first_name, last_name: last_name, username: login_email }, (err, employee) => {
            Shift.findOne({ title: work_shift }, (err, shift) => {
                if (employee) {
                    req.flash('danger', 'Employee already exists.');
                    res.redirect('/company/add_new_employee')
                }
                else {
                    let data = new Employee();

                    // Personal Details
                    data.company_id = req.user.company_id;
                    data.first_name = first_name;
                    data.last_name = last_name;
                    data.middle_name = middle_name;
                    data.username = login_email;
                    data.id_number = id_number
                    data.kra_pin = kra_pin;
                    data.status = 'Active'
                    data.gender = gender;
                    data.dob = dob;
                    data.nhif_no = nhif_no;
                    data.nssf_no = nssf_no;
                    data.resident_type = resident;

                    // hr_details
                    data.employee_type = employee_type;
                    data.job_title = job_title;
                    data.department = department;
                    data.region = region;
                    data.suspension_details = []


                    // salary details
                    data.salary_details.employee_type = employee_type;
                    data.salary_details.payment_currency = company.currency;
                    data.salary_details.salary = salary;
                    if (employee_type === 'Casual Employee') {
                        data.salary_details.salary_type = 'Daily';
                    }
                    else if (employee_type === 'Secondary Employee') {
                        data.salary_details.salary_type = 'Monthly';
                    }
                    else if (employee_type === 'Primary Employee') {
                        data.salary_details.salary_type = 'Monthly';
                    }

                    data.salary_details.work_shift = work_shift;
                    data.salary_details.off_days = off_days;
                    data.salary_details.daily_hours = shift.work_hours;
                    if (employee_type === 'Primary Employee') {
                        data.salary_details.income_tax = 'P.A.Y.E Primary Employee';
                    }
                    else if (employee_type === 'Secondary Employee') {
                        data.salary_details.income_tax = 'P.A.Y.E Secondary Employee';
                    }
                    else if (employee_type === 'Casual Employee') {
                        data.salary_details.income_tax = 'P.A.Y.E Primary Employee';
                    }

                    data.salary_details.salary_history = [
                        {
                            salary: salary,
                            salary_type: data.salary_details.salary_type,
                            payment_currency: company.currency,
                            status: 'Current',
                            added_on: date.today
                        }
                    ]
                    if (disability_exemption_amount !== '' && exemption_certificate_no !== '') {
                        data.salary_details.tax_exemption_val = true
                        data.salary_details.tax_exemption = {
                            disability_exemption_amount: disability_exemption_amount,
                            exemption_certificate_no: exemption_certificate_no,
                            approval: false
                        }
                    }
                    if (disability_exemption_amount === '' && exemption_certificate_no === '') {
                        data.salary_details.tax_exemption = {}
                        data.salary_details.tax_exemption_val = false
                    }
                    data.salary_details.payment_type = ''
                    data.salary_details.payment_details = [];



                    // hr details
                    data.hr_details.job_number = job_number;
                    data.hr_details.job_title = job_title;
                    data.hr_details.region = region;
                    data.hr_details.company = subsidiary
                    data.hr_details.department = department;
                    data.hr_details.head_of_department = head_of_department;
                    data.hr_details.reports_to = reports_to;
                    data.hr_details.date_of_employment = date_of_employment;
                    data.hr_details.contract_start_date = contract_start_date;
                    data.hr_details.contract_end_date = contract_end_date;
                    data.hr_details.contract_duration = contract_duration

                    if (head_of_department !== '') {
                        data.manager = true
                    }
                    else if (head_of_department === '') {
                        data.manager = false
                    }


                    // education details
                    data.education.university = university;
                    data.education.level_of_education = level_of_education;
                    data.education.gpa = gpa;
                    data.education.course = course;


                    // contact details
                    data.contact_details.official_email = official_email;
                    data.contact_details.personal_email = personal_email;

                    data.contact_details.mobile_phone_no = mobile_phone_no;
                    data.contact_details.official_phone_no = official_phone_no;

                    data.contact_details.country = country;
                    data.contact_details.address = address;

                    data.contact_details.city = city;
                    data.contact_details.county = county;
                    data.contact_details.zip_code = zip_code;

                    // Next of Kin
                    const array_next_of_kin = []

                    // kin1
                    if (next_of_kin_fullname !== '') {
                        const kin1 = {
                            next_of_kin_fullname: next_of_kin_fullname,
                            next_of_kin_relation: next_of_kin_relation,
                            next_of_kin_phone: next_of_kin_phone,
                            next_of_kin_email: next_of_kin_email
                        }
                        array_next_of_kin.push(kin1)
                    }


                    // kin2
                    else if (next_of_kin_fullname2 !== '') {
                        const kin2 = {
                            next_of_kin_fullname2: next_of_kin_fullname2,
                            next_of_kin_relation2: next_of_kin_relation2,
                            next_of_kin_phone2: next_of_kin_phone2,
                            next_of_kin_email2: next_of_kin_email2
                        }
                        array_next_of_kin.push(kin2)
                    }

                    data.contact_details.next_of_kin = array_next_of_kin

                    // social media
                    data.contact_details.social_media.twitter = twitter;
                    data.contact_details.social_media.linkedin = linkedin;

                    // pension details

                    if (pension === 'Yes') {

                        data.pension_amount = pension_amount
                        data.pension = true

                    }
                    else if (pension === 'No') {
                        data.pension_amount = pension_amount
                        data.pension = true
                    }



                    // files
                    if (typeof req.files === 'object') {
                        // resume letter
                        if (req.files.resume_letter === undefined) {
                            data.files.resume_letter = ''
                        }
                        else if (req.files.resume_letter !== undefined) {
                            const resume_letter = '/resume_letters/' + req.files.resume_letter[0].filename;
                            data.files.resume_letter = resume_letter
                        }

                        // cover letter
                        if (req.files.cover_letter === undefined) {
                            data.files.cover_letter = ''
                        }
                        else if (req.files.cover_letter !== undefined) {
                            const cover_letter = '/cover_letters/' + req.files.cover_letter[0].filename;
                            data.files.cover_letter = cover_letter
                        }


                        // certificates
                        if (req.files.certificate === undefined) {
                            data.files.certificate = ''
                        }
                        else if (req.files.certificate !== undefined) {
                            const certificate = '/certificates/' + req.files.certificate[0].filename;
                            data.files.certificate = certificate
                        }


                        // passport_photo
                        if (req.files.passport_photo === undefined) {
                            if (gender === 'Male') {
                                data.files.passport_photo = '/images/male.png'
                            }
                            else if (gender === 'Female') {
                                data.files.passport_photo = '/images/female.png'
                            }
                        }
                        else if (req.files.passport_photo !== undefined) {
                            const passport_photo = '/passport_photos/' + req.files.passport_photo[0].filename;
                            data.files.passport_photo = passport_photo
                        }

                    }
                    if (nssf_checkbox === 'on') {
                        data.nssf = true
                    }
                    else {
                        data.nssf = false
                    }
                    if (nhif_checkbox === 'on') {
                        data.nhif = true
                    }
                    else {
                        data.nhif = false
                    }
                    if (nita_checkbox === 'on') {
                        data.nita = true
                    }
                    else {
                        data.nita = false
                    }

                    // password
                    data.password = 'gbl_' + random
                    data.pass = 'gbl_' + random
                    bcrypt.genSalt(10, function (err, salt) {
                        bcrypt.hash('gbl_' + random, salt, function (err, hash) {
                            data.password = hash
                            setTimeout(() => {
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
                                    to: login_email,
                                    subject: 'WELCOME TO THE PAYROLL SYSTEM',
                                    text: 'Hi ' + first_name + ', here are your login credentials for the selfcare portal.\n Email: ' + login_email + '\n Password: gbl_' + random
                                };

                                transporter.sendMail(mailOptions, function (error, info) {
                                    if (error) {
                                        console.log(error);
                                    } else {
                                        console.log('Email sent: ' + info.response);
                                    }
                                });
                                data.save((err, result) => {
                                    // company
                                    Company.findById(req.user.company_id, (err, company) => {
                                        let query = {
                                            _id: req.user.company_id
                                        }
                                        let data = {}
                                        data.employees = company.employees + 1
                                        Company.update(query, data, () => {

                                        })
                                    })

                                    //relief
                                    if (resident === 'Resident') {
                                        Relief.findOne({ company_id: req.user.company_id, item: 'Personal Relief' }, (err, relief) => {
                                            if (relief) {
                                                let data = new EmployeeRelief(
                                                    {
                                                        title: 'Personal Relief',
                                                        employee_id: result.id,
                                                        company_id: req.user.company_id,
                                                        amount: relief.amount,
                                                        maximum_amount: relief.maximum_amount,
                                                        status: 'Active'
                                                    }
                                                )
                                                data.save(() => {

                                                })
                                            }

                                        })

                                    }


                                    // NHIF CHECKBOX
                                    if (nhif_checkbox === 'on') {
                                        console.log('DONE DONE')
                                        Deduction.findOne({ title: 'NHIF', company_id: req.user.company_id }, (err, deduct) => {
                                            if (deduct) {
                                                console.log(deduct)
                                                Rate.find({ deduct_id: deduct.id }, (err, rates) => {
                                                    console.log(rates)
                                                    if (rates.length > 0) {

                                                        if (result.salary_details.salary_type === 'Monthly') {
                                                            rates.map((item) => {
                                                                if (parseInt(result.salary_details.salary) >= parseInt(item.minimum_amount) && parseInt(result.salary_details.salary) < parseInt(item.maximum_amount)) {


                                                                    const data = new EmployeeDeduct({
                                                                        type: 'NHIF',
                                                                        employee_id: result.id,
                                                                        company_id: req.user.company_id,
                                                                        amount: item.amount,
                                                                        status: 'Active',
                                                                        tax: deduct.type,
                                                                        account_name: result.first_name + ' ' + result.last_name,
                                                                        account_number: result.nhif_no,
                                                                        added_on: date.today

                                                                    })
                                                                    data.save(() => {

                                                                    })
                                                                }

                                                            })

                                                        }

                                                    }
                                                    else {
                                                        const data = new EmployeeDeduct({
                                                            type: 'NHIF',
                                                            employee_id: result.id,
                                                            company_id: req.user.company_id,
                                                            amount: 0,
                                                            status: 'Active',
                                                            tax: deduct.type,
                                                            account_name: result.first_name + ' ' + result.last_name,
                                                            account_number: result.nhif_no,
                                                            added_on: date.today

                                                        })
                                                        data.save(() => {

                                                        })
                                                    }

                                                })
                                            }
                                        })
                                    }

                                    if (nssf_checkbox === 'on') {
                                        Deduction.findOne({ title: 'NSSF', company_id: req.user.company_id }, (err, deduct) => {

                                            if (deduct) {

                                                const data = new EmployeeDeduct({
                                                    type: 'NSSF',
                                                    employee_id: result.id,
                                                    company_id: req.user.company_id,
                                                    amount: 200,
                                                    status: 'Active',
                                                    tax: deduct.type,
                                                    account_name: first_name + ' ' + last_name,
                                                    account_number: nssf_no,
                                                    added_on: date.today

                                                })
                                                data.save(() => {

                                                })

                                            }
                                            else {
                                                const data = new EmployeeDeduct({
                                                    type: 'NSSF',
                                                    employee_id: result.id,
                                                    company_id: req.user.company_id,
                                                    amount: 200,
                                                    status: 'Active',
                                                    tax: deduct.type,
                                                    account_name: first_name + ' ' + last_name,
                                                    account_number: nssf_no,
                                                    added_on: date.today

                                                })
                                                data.save(() => {
                                                  
                                                })

                                            }

                                        })
                                    }


                                    req.flash('info', 'Employee added successfully.');
                                    res.redirect('/company/view_employee/' + result.id)
                                })
                            }, 2500)

                        })
                    });


                }
            })

        })
    })
}

const edit_employee_post = (req, res) => {
    const { first_name, middle_name, last_name, gender, dob, id_number, kra_pin, nssf_no, nhif_no, resident, job_number, job_title, date_of_employment, subsidiary, department, head_of_department, reports_to, region, contract_start_date, contract_end_date, contract_duration, university, level_of_education, gpa, course, official_email, personal_email, country, mobile_phone_no, official_phone_no, city, county, address, zip_code, linkedin, twitter, login_email, } = req.body

    const id = req.params.id;

    Employee.findById(id, (err, employee) => {

        let query = {
            _id: req.params.id
        }
        let data = {}
        data.first_name = first_name;
        data.last_name = last_name;
        data.middle_name = middle_name;
        data.username = login_email;
        data.id_number = id_number
        data.kra_pin = kra_pin;
        data.gender = gender;
        data.dob = dob;
        data.nhif_no = nhif_no;
        data.nssf_no = nssf_no;
        data.resident_type = resident;

        // hr details

        employee.hr_details.job_number = job_number;
        employee.hr_details.job_title = job_title;
        employee.hr_details.region = region;
        employee.hr_details.company =subsidiary
        employee.hr_details.department = department;
        employee.hr_details.head_of_department = head_of_department;
        employee.hr_details.reports_to = reports_to;
        employee.hr_details.date_of_employment = date_of_employment;
        employee.hr_details.contract_start_date = contract_start_date;
        employee.hr_details.contract_end_date = contract_end_date;
        employee.hr_details.contract_duration = contract_duration


        data.hr_details = employee.hr_details

        if (head_of_department !== '') {
            data.manager = true
        }
        else if (head_of_department === '') {
            data.manager = false
        }


        // education details
        employee.education.university = university;
        employee.education.level_of_education = level_of_education;
        employee.education.gpa = gpa;
        employee.education.course = course;

        data.education = employee.education

        // contact details
        employee.contact_details.official_email = official_email;
        employee.contact_details.personal_email = personal_email;

        employee.contact_details.mobile_phone_no = mobile_phone_no;
        employee.contact_details.official_phone_no = official_phone_no;

        employee.contact_details.country = country;
        employee.contact_details.address = address;

        employee.contact_details.city = city;
        employee.contact_details.county = county;
        employee.contact_details.zip_code = zip_code;

        // social media
        employee.contact_details.social_media.twitter = twitter;
        employee.contact_details.social_media.linkedin = linkedin;

        data.contact_details = employee.contact_details

        // files
        if (typeof req.files === 'object') {

            // resume letter
            if (req.files.resume_letter === undefined) {
                employee.files.resume_letter = ''
            }
            else if (req.files.resume_letter !== undefined) {
                const resume_letter = '/resume_letters/' + req.files.resume_letter[0].filename;
                employee.files.resume_letter = resume_letter
            }

            // cover letter
            if (req.files.cover_letter === undefined) {
                employee.files.cover_letter = ''
            }
            else if (req.files.cover_letter !== undefined) {
                const cover_letter = '/cover_letters/' + req.files.cover_letter[0].filename;
                employee.files.cover_letter = cover_letter
            }


            // certificates
            if (req.files.certificate === undefined) {
                employee.files.certificate = ''
            }
            else if (req.files.certificate !== undefined) {
                const certificate = '/certificates/' + req.files.certificate[0].filename;
                employee.files.certificate = certificate
            }


            // passport_photo
            if (req.files.passport_photo === undefined) {
                if (gender === 'Male') {
                    employee.files.passport_photo = '/images/male.png'
                }
                else if (gender === 'Female') {
                    employee.files.passport_photo = '/images/female.png'
                }
            }

            else if (req.files.passport_photo !== undefined) {
                const passport_photo = '/passport_photos/' + req.files.passport_photo[0].filename;
                employee.files.passport_photo = passport_photo
            }

        }
        data.files = employee.files

        Employee.update(query, data, (err) => {
            if (resident === 'Non-resident') {

                EmployeeRelief.remove({ company_id: req.user.company_id, title: 'Personal Relief', employee_id: req.params.id }, (err) => {
                   
                })
                EmployeeRelief.remove({ company_id: req.user.company_id, title: 'Insurance Relief', employee_id: req.params.id }, (err) => {
                   
                })
            }
            if (resident === 'Resident') {
                Relief.findOne({ company_id: req.user.company_id, item: 'Personal Relief' }, (err, relief) => {
                    if (relief) {
                        EmployeeRelief.findOne({ company_id: req.user.company_id, title: 'Personal Relief', employee_id: req.params.id }, (err, relief2) => {
                            if (relief2) {
                                EmployeeRelief.findOneAndRemove(relief2.id, (err) => {
                                    let data = new EmployeeRelief(
                                        {
                                            title: 'Personal Relief',
                                            employee_id: req.params.id,
                                            company_id: req.user.company_id,
                                            amount: relief.amount,
                                            maximum_amount: relief.maximum_amount,
                                            status: 'Active'
                                        }
                                    )
                                    data.save(() => {

                                    })
                                })
                            }
                            else {
                                let data = new EmployeeRelief(
                                    {
                                        title: 'Personal Relief',
                                        employee_id: req.params.id,
                                        company_id: req.user.company_id,
                                        amount: relief.amount,
                                        maximum_amount: relief.maximum_amount,
                                        status: 'Active'
                                    }
                                )
                                data.save(() => {

                                })
                            }
                        })

                    }

                })

            }

            req.flash('info', 'Employee updated successfully.');
            res.redirect("/company/edit_employee/" + req.params.id)

        })

    })
}




const view_employee = (req, res) => {
    Company.findById(req.user.company_id, (err, company) => {

        if (!company.enabled) {
            req.flash('danger', 'License has expired. Please contact the administrator for renewal: Email: ' + process.env.EMAIL)
            res.redirect('/company/validate_license')
        }
        else {

            const id = req.params.id;
            Employee.find({ company_id: req.user.company_id }, (err, employees) => {
                Job.find({ company_id: req.user.company_id }, (err, jobs) => {
                    Employee.find({ company_id: req.user.company_id, manager: true }, (err, managers) => {
                        Department.find({ company_id: req.user.company_id, casual: true }, (err, departments) => {
                            CasualSetting.findOne({ no: 1, company_id: req.user.company_id }, (err, setting) => {

                                Region.find({ company_id: req.user.company_id }, (err, regions) => {
                                    Shift.find({ company_id: req.user.company_id }, (err, shifts) => {
                                        Subsidiary.find({ company_id: req.user.company_id }, (err, companies) => {
                                            Bank.find({}, (err, banks) => {
                                                Employee.findById(id, (err, employee) => {
                                                    AppliedExpense.find({ employee_id: id, company_id: req.user.company_id }, (err, expenses) => {
                                                        Benefit.find({ company_id: req.user.company_id, status: 'Active' }, (err, benefits) => {
                                                            Deduction.find({ company_id: req.user.company_id, status: 'Active' }, (err, deductions) => {
                                                                Loan.find({ company_id: req.user.company_id, status: 'Active' }, (err, loans) => {
                                                                    EmployeeBenefit.find({ employee_id: id, company_id: req.user.company_id }, (err, employee_benefits) => {
                                                                        EmployeeDeduct.find({ employee_id: id, company_id: req.user.company_id }, (err, employee_deducts) => {
                                                                            EmployeeLoan.find({ employee_id: id, company_id: req.user.company_id }, (err, employee_loans) => {
                                                                                Pay.find({ employee_id: id, company_id: req.user.company_id }, (err, pays) => {
                                                                                    EmployeeRelief.find({ employee_id: id, company_id: req.user.company_id }, (err, reliefs) => {
                                                                                        Relief.find({ company_id: req.user.company_id }, (err, rels) => {
                                                                                            Casual.find({ company_id: req.user.company_id, employee_id: id }, (err, casuals) => {
                                                                                                AppliedLeave.find({ company_id: req.user.company_id, status: 'Pending' }, (err, leaves2) => {
                                                                                                    AppliedExpense.find({ company_id: req.user.company_id, status: 'Pending' }, (err, expenses2) => {
                                                                                                        CCRating.find({ company_id: req.user.company_id }, (err, rates) => {
                                                                                                            Attendance.find({employee_id:id,company_id:req.user.company_id,approved:false,date:today},(err,attendances)=>{
                                                                                                                let total_hours =0
                                                                                                                attendances.map((item)=>{
                                                                                                                    total_hours += parseInt(item.hours)
                                                                                                                })
                                                                                                         
                                                                                                            let no = []
                                                                                                            employee_benefits.map((item) => {
                                                                                                                no.push(item.amount)
                                                                                                            })
                                                                                                            setTimeout(() => {
                                                                                                                let total_gross_pay = parseInt(no.reduce((a, b) => a + b, 0)) + parseInt(employee.salary_details.salary)
                                                                                                                res.render('./company/employee/view_employee.jade', {
                                                                                                                    employee: employee,
                                                                                                                    total_hours:total_hours,
                                                                                                                    user: req.user,
                                                                                                                    user: req.user,
                                                                                                                    employees: employees,
                                                                                                                    jobs: jobs,
                                                                                                                    attendances:attendances,
                                                                                                                    company: company,
                                                                                                                    today: date.today,
                                                                                                                    total_gross_pay: total_gross_pay,
                                                                                                                    departments: departments,
                                                                                                                    setting: setting,
                                                                                                                    regions: regions,
                                                                                                                    shifts: shifts,
                                                                                                                    companies: companies,
                                                                                                                    reliefs: reliefs,
                                                                                                                    banks: banks,
                                                                                                                    managers: managers,
                                                                                                                    expenses: expenses,
                                                                                                                    amount: true,
                                                                                                                    rates: rates,
                                                                                                                    loans: loans,
                                                                                                                    deductions: deductions,
                                                                                                                    benefits: benefits,
                                                                                                                    employee_benefits: employee_benefits,
                                                                                                                    employee_deducts: employee_deducts,
                                                                                                                    employee_loans: employee_loans,
                                                                                                                    pays: pays,
                                                                                                                    rels: rels,
                                                                                                                    leaves2: leaves2,
                                                                                                                    expenses2: expenses2,
                                                                                                                    casuals: casuals,
                                                                                                                    month: monthNames[monthNo]
                                                                                                                })
                                                                                                            }, 2000)
                                                                                                                   
                                                                                                        })
                                                                                                        })

                                                                                                    })
                                                                                                })
                                                                                            }).sort({ _id: -1 })

                                                                                        })



                                                                                    })
                                                                                }).sort({ _id: -1 })

                                                                            })
                                                                        })
                                                                    })

                                                                })
                                                            })

                                                        }).sort({ _id: -1 })

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

const add_employee_loan = (req, res) => {
    const id = req.params.id;
    const { type, amount, account_name, account_number, loan_amount, start_date, end_date } = req.body;
    EmployeeLoan.findOne({ type: type, employee_id: id, company_id: req.user.company_id }, (err, exist) => {
        if (exist) {
            req.flash('danger', 'Loan already exists.');
            res.redirect('/company/view_employee/' + id)
        }
        else {
            let data = new EmployeeLoan();
            data.type = type;
            data.amount = amount;
            data.loan_amount = loan_amount
            data.start_date = start_date;
            data.end_date = end_date
            data.status = 'Active'
            data.added_on = date.today;
            data.account_name = account_name;
            data.account_number = account_number
            data.company_id = req.user.company_id
            data.employee_id = id;
            data.save(() => {
                req.flash('info', 'Loan added successfully.');
                res.redirect('/company/view_employee/' + id)
            })
        }
    })

}
const add_employee_deduction = (req, res) => {
    const id = req.params.id;
    const { type, amount, account_name, account_number } = req.body;
    Employee.findById(id, (err, employee) => {

        EmployeeDeduct.findOne({ type: type, employee_id: id, company_id: req.user.company_id }, (err, exist) => {
            if (exist) {
                req.flash('danger', 'Deduction already exists.');
                res.redirect('/company/view_employee/' + id)
            }
            else {

                Deduction.findOne({ title: type, company_id: req.user.company_id }, (err, deduction) => {

                    if (type === 'NSSF') {
                        let data = new EmployeeDeduct();
                        data.type = type;
                        data.amount = 200;
                        data.status = 'Active'
                        data.tax = deduction.type
                        data.added_on = date.today;
                        data.account_name = employee.first_name + ' ' + employee.last_name
                        data.account_number = employee.nssf_no
                        data.company_id = req.user.company_id
                        data.employee_id = id;
                        data.save(() => {
                            req.flash('info', 'Deduction added successfully.');
                            res.redirect('/company/view_employee/' + id)
                        })
                    }
                    else if (type === 'NHIF') {

                        Rate.find({ deduct_id: deduction.id }, (err, rates) => {

                            if (rates.length > 0) {

                                if (employee.salary_details.salary_type === 'Monthly') {
                                    rates.map((item) => {
                                        if (parseInt(employee.salary_details.salary) >= parseInt(item.minimum_amount) && parseInt(employee.salary_details.salary) < parseInt(item.maximum_amount)) {


                                            const data = new EmployeeDeduct({
                                                type: 'NHIF',
                                                employee_id: id,
                                                company_id: req.user.company_id,
                                                amount: item.amount,
                                                status: 'Active',
                                                tax: deduction.type,
                                                account_name: employee.first_name + ' ' + employee.last_name,
                                                account_number: employee.nhif_no,
                                                added_on: date.today

                                            })
                                            data.save(() => {
                                                req.flash('info', 'Deduction added successfully.');
                                                res.redirect('/company/view_employee/' + id)
                                            })
                                        }

                                    })

                                }

                            }
                            else {
                                const data = new EmployeeDeduct({
                                    type: 'NHIF',
                                    employee_id: id,
                                    company_id: req.user.company_id,
                                    amount: 0,
                                    status: 'Active',
                                    tax: deduction.type,
                                    account_name: employee.first_name + ' ' + employee.last_name,
                                    account_number: employee.nhif_no,
                                    added_on: date.today

                                })
                                data.save(() => {
                                    req.flash('info', 'Deduction added successfully.');
                                    res.redirect('/company/view_employee/' + id)
                                })
                            }

                        })

                    }

                    else {
                        if (parseInt(amount) > 0) {
                            let data = new EmployeeDeduct();
                            data.type = type;
                            data.amount = amount;
                            data.status = 'Active'
                            data.tax = deduction.type
                            data.added_on = date.today;
                            data.account_name = account_name;
                            data.account_number = account_number
                            data.company_id = req.user.company_id
                            data.employee_id = id;
                            data.save(() => {
                                req.flash('info', 'Deduction added successfully.');
                                res.redirect('/company/view_employee/' + id)
                            })
                        }
                        else {
                            req.flash('danger', 'Total deduction amount is required.');
                            res.redirect('/company/view_employee/' + id)
                        }

                    }
                })



            }
        })
    })
}
const add_employee_benefit = (req, res) => {
    const id = req.params.id;

    const { type, amount, total_gross_pay, net_value_of_housing, rent_recovered_from_employee, market_rate, type_of_housing, type_of_employee, nature_of_allowance, total_cost_of_allowance, type_of_furniture, cost_of_owned_or_leased_furniture, total_amount_of_bill, number_of_days, total_amount_paid, cost_of_meal_benefit, cost_of_motor_vehicle, car_registration_no, car_make, car_body_type, cc_rating, type_of_car_cost, cost_of_hiring, } = req.body;
    EmployeeBenefit.findOne({ type: type, employee_id: id, company_id: req.user.company_id }, (err, exist) => {
        if (exist) {
            req.flash('danger', 'Benefit already exists.');
            res.redirect('/company/view_employee/' + id)
        }
        else {
            Benefit.findOne({ title: type, company_id: req.user.company_id }, (err, benefit) => {
                let ben = 0
                if (benefit.title === 'Car Benefit') {
                    if (parseInt(cost_of_motor_vehicle) < 1) {
                        req.flash('danger', 'Cost of motor vehicle is required.')
                        res.redirect('/company/view_employee/' + id)
                    }
                    else if (car_registration_no === '') {
                        req.flash('danger', 'Car Registration Number is required.')
                        res.redirect('/company/view_employee/' + id)
                    }
                    else if (car_make === '') {
                        req.flash('danger', 'Car Make is required.')
                        res.redirect('/company/view_employee/' + id)
                    }
                    else if (car_body_type === '') {
                        req.flash('danger', 'Car Body Type is required.')
                        res.redirect('/company/view_employee/' + id)
                    }
                    else if (cc_rating === '') {
                        req.flash('danger', 'CC Rating is required.')
                        res.redirect('/company/view_employee/' + id)

                    }
                    else if (type_of_car_cost === '') {
                        req.flash('danger', 'Type of car cost is required.')
                        res.redirect('/company/view_employee/' + id)
                    }
                    else {

                        let rate = 0;
                        CCRating.findOne({ company_id: req.user.company_id, cubic_centimetres: parseInt(cc_rating) }, (err, rate) => {
                            if (rate) {
                                rate = rate.amount
                            }
                        }
                        )

                        let second_amount = parseInt(cost_of_motor_vehicle) * (parseInt(benefit.value) / 100);


                        setTimeout(() => {
                            if (parseInt(rate) > parseInt(second_amount)) {

                                ben = rate
                            }
                            else if (parseInt(second_amount) > parseInt(rate)) {

                                ben = second_amount
                            }

                            let data = new EmployeeBenefit();
                            data.type = type;
                            data.amount = ben
                            data.status = 'Active'
                            data.company_id = req.user.company_id
                            data.added_on = date.today;
                            data.post = req.body.post
                            data.employee_id = id;
                            data.car_benefit_details = {
                                benefit:ben,
                                cost_of_motor_vehicle: cost_of_motor_vehicle,
                                car_registration_no: car_registration_no,
                                car_make: car_make,
                                car_body_type: car_body_type,
                                cc_rating: cc_rating,
                                type_of_car_cost: type_of_car_cost,
                                cost_of_hiring: cost_of_hiring,

                            }
                            data.save(() => {
                                req.flash('info', 'Benefit added successfully.');
                                res.redirect('/company/view_employee/' + id)
                            })
                        }, 2000)

                    }

                }
                else if (benefit.title === 'Meal Allowance') {
                    if (parseInt(cost_of_meal_benefit) === 0) {
                        req.flash('danger', 'Cost of meal benefit is required.')
                        res.redirect('/company/view_employee/' + id)
                    }
                    else {

                        if (parseInt(cost_of_meal_benefit) > parseInt(benefit.value)) {
                            ben = cost_of_meal_benefit - parseInt(benefit.value)

                            let data = new EmployeeBenefit();
                            data.type = type;
                            data.amount = ben
                            data.status = 'Active'
                            data.company_id = req.user.company_id
                            data.added_on = date.today;
                            data.post = req.body.post
                            data.employee_id = id;
                            data.meal_benefit_details = {
                                benefit:ben,
                                cost_of_meal_benefit: cost_of_meal_benefit
                            }
                            data.save(() => {
                                req.flash('info', 'Benefit added successfully.');
                                res.redirect('/company/view_employee/' + id)
                            })
                        }
                        else if (parseInt(cost_of_meal_benefit) < parseInt(benefit.value)) {
                            req.flash('danger', 'Cost of meal benefit is less than maximum amount.');
                            res.redirect('/company/view_employee/' + id)
                        }



                    }
                }
                else if (benefit.title === 'Per Diem') {
                    let daily_amount = parseInt(total_amount_paid) / parseInt(number_of_days)
                    if (daily_amount > parseInt(benefit.value)) {
                        let amount = daily_amount - parseInt(benefit.value);
                        ben = amount * parseInt(number_of_days);

                        let data = new EmployeeBenefit();
                        data.type = type;
                        data.amount = ben
                        data.status = 'Active'
                        data.company_id = req.user.company_id
                        data.added_on = date.today;
                        data.post = req.body.post
                        data.employee_id = id;
                        data.per_diem_details = {
                            benefit:ben,
                            total_amount_paid: total_amount_paid,
                            number_of_days: number_of_days
                        }

                        data.save(() => {
                            req.flash('info', 'Benefit added successfully.');
                            res.redirect('/company/view_employee/' + id)
                        })
                    }
                    else if (daily_amount < parseInt(benefit.value)) {
                        req.flash('danger', 'Cost of meal benefit is less than maximum amount per day.');
                        res.redirect('/company/view_employee/' + id)
                    }
                }
                else if (benefit.title === 'Mobile Benefit') {
                    if (parseInt(total_amount_of_bill) > 0) {
                        ben = parseInt(total_amount_of_bill) * (benefit.value / 100)
                        let data = new EmployeeBenefit();
                        data.type = type;
                        data.amount = ben
                        data.status = 'Active'
                        data.company_id = req.user.company_id
                        data.added_on = date.today;
                        data.post = req.body.post
                        data.employee_id = id;

                        data.mobile_benefit_details = {
                            benefit:ben,
                            total_amount_of_bill: total_amount_of_bill
                        }
                        data.save(() => {
                            req.flash('info', 'Benefit added successfully.');
                            res.redirect('/company/view_employee/' + id)
                        })
                    }
                    else {
                        req.flash('danger', 'Total Amount of bill cannot be less than or equal to 0.');
                        res.redirect('/company/view_employee/' + id)
                    }
                }
                else if (benefit.title === 'Furniture Allowance') {
                    ben = parseInt(cost_of_owned_or_leased_furniture) * (parseInt(benefit.value) / 100)
                    if (parseInt(cost_of_owned_or_leased_furniture) > 0) {
                        let data = new EmployeeBenefit();
                        data.type = type;
                        data.amount = ben
                        data.status = 'Active'
                        data.company_id = req.user.company_id
                        data.added_on = date.today;
                        data.post = req.body.post
                        data.employee_id = id;

                        data.furniture_details = {
                            benefit:ben,
                            cost_of_owned_or_leased_furniture: cost_of_owned_or_leased_furniture,
                            type_of_furniture: type_of_furniture
                        }
                        data.save(() => {
                            req.flash('info', 'Benefit added successfully.');
                            res.redirect('/company/view_employee/' + id)
                        })

                    }
                    else if (type_of_furniture === '') {
                        req.flash('danger', 'Type of furniture is required.');
                        res.redirect('/company/view_employee/' + id)
                    }
                    else if (parseInt(cost_of_owned_or_leased_furniture) <= 0) {
                        req.flash('danger', 'Cost of furniture cannot be less than or equal to 0.');
                        res.redirect('/company/view_employee/' + id)
                    }
                }
                else if (benefit.title === 'Non Cash Allowances') {
                    if (nature_of_allowance === '') {
                        req.flash('danger', 'Nature of allowance is required.');
                        res.redirect('/company/view_employee/' + id)
                    }
                    else if (parseInt(total_cost_of_allowance) > parseInt(benefit.value)) {
                        ben = parseInt(total_cost_of_allowance) - parseInt(benefit.value);
                        let data = new EmployeeBenefit();
                        data.type = type;
                        data.amount = ben
                        data.status = 'Active'
                        data.company_id = req.user.company_id
                        data.added_on = date.today;
                        data.post = req.body.post
                        data.employee_id = id;

                        data.non_cash_allowances_details = {
                            benefit:ben,
                            total_cost_of_allowance: total_cost_of_allowance,
                            nature_of_allowance: nature_of_allowance

                        }
                        data.save(() => {
                            req.flash('info', 'Benefit added successfully.');
                            res.redirect('/company/view_employee/' + id)
                        })

                    }
                    else {
                        req.flash('danger', 'Total cost of allowance should be greater than the excess limit of ' + parseInt(benefit.value));
                        res.redirect('/company/view_employee/' + id)
                    }

                }
                else if (benefit.title === 'Housing Allowance') {

                    if (net_value_of_housing < 1) {
                        req.flash('danger', 'Net value of house is required.')
                        res.redirect('/company/view_employee/' + id)

                    }
                    else if (market_rate < 1) {
                        req.flash('danger', 'Market rate is required.')
                        res.redirect('/company/view_employee/' + id)
                    }
                    else if (type_of_housing === '') {
                        req.flash('danger', 'Type of housing is required.')
                        res.redirect('/company/view_employee/' + id)

                    }
                    else if (type_of_employee === '') {
                        req.flash('danger', 'Type of employee is required.')
                        res.redirect('/company/view_employee/' + id)
                    }
                    else {

                        HouseAllowance.findOne({ type: type_of_employee, company_id: req.user.company_id }, (err, house) => {

                            let arr = []
                            let gross = parseInt(total_gross_pay) * (parseInt(house.value) / 100)
                            arr.push(parseInt(gross))
                            arr.push(parseInt(net_value_of_housing))
                            arr.push(parseInt(market_rate))
                            var minimum = Math.min(...arr);
                            ben = parseInt(minimum)
                        })
                        setTimeout(() => {
                            let data = new EmployeeBenefit();
                            data.type = type;
                            data.amount = ben
                            data.status = 'Active'
                            data.company_id = req.user.company_id
                            data.added_on = date.today;
                            data.post = req.body.post
                            data.employee_id = id;

                            data.housing_allowance_details = {
                                benefit:ben,
                                type_of_employee: type_of_employee,
                                type_of_housing: type_of_housing,
                                market_rate: market_rate,
                                rent_recovered_from_employee: rent_recovered_from_employee,
                                net_value_of_housing: net_value_of_housing,
                                total_gross_pay: total_gross_pay


                            }
                            data.save(() => {
                                req.flash('info', 'Benefit added successfully.');
                                res.redirect('/company/view_employee/' + id)
                            })
                        }, 2000)


                    }
                }
                else {
                    let data = new EmployeeBenefit();
                    data.type = type;
                    data.amount = amount
                    data.status = 'Active'
                    data.company_id = req.user.company_id
                    data.added_on = date.today;
                    data.post = req.body.post
                    data.employee_id = id;

                    data.save(() => {
                        req.flash('info', 'Benefit added successfully.');
                        res.redirect('/company/view_employee/' + id)
                    })
                }







            })

        }
    })

}



const delete_employee = (req, res) => {
    const id = req.params.id
    Company.findById(req.user.company_id, (err, company) => {
        let query = {
            _id: req.user.company_id
        }
        let data = {}
        data.employees = company.employees - 1
        Company.update(query, data, () => {

        })
    })
    Employee.findById(id, (err, employee) => {
        const passport_photo = './uploads' + employee.files.passport_photo
        const resume_letter = './uploads' + employee.files.resume_letter
        const cover_letter = './uploads' + employee.files.cover_letter
        const certificate = './uploads' + employee.files.certificate
        fs.unlink(passport_photo, (err) => {

        })
        fs.unlink(resume_letter, (err) => {

        })

        fs.unlink(cover_letter, (err) => {

        })

        fs.unlink(certificate, (err) => {

        })


        Employee.findByIdAndRemove(id, (err) => {
            req.flash('danger', 'Employee deleted successfully.');
            res.redirect('/company/employees')
        })
    })



}

const activate_relief = (req, res) => {
    const id = req.params.id;
    const id2 = req.params.id2
    let query = {
        _id: id
    }
    let data = {};
    data.status = 'Active'
    EmployeeRelief.update(query, data, () => {
        req.flash('info', 'Relief activated successfully.');
        res.redirect('/company/view_employee/' + id)
    })


}
const deactivate_relief = (req, res) => {
    const id = req.params.id;
    const id2 = req.params.id2
    let query = {
        _id: id
    }
    let data = {};
    data.status = 'Inactive'
    EmployeeRelief.update(query, data, () => {
        req.flash('danger', 'Relief deactivated successfully.');
        res.redirect('/company/view_employee/' + id)
    })

}
const delete_relief = (req, res) => {
    const id = req.params.id;
    const id2 = req.params.id2
    EmployeeRelief.findByIdAndRemove(id2, (err) => {
        req.flash('danger', 'Relief deleted successfully.');
        res.redirect('/company/view_employee/' + id)
    })

}

const delete_loan = (req, res) => {
    const id = req.params.id
    const id2 = req.params.id2
    EmployeeLoan.findByIdAndRemove(id2, (err) => {
        req.flash('danger', 'Loan deleted successfully.');
        res.redirect('/company/view_employee/' + id)
    })

}
const delete_deduct = (req, res) => {
    const id = req.params.id
    const id2 = req.params.id2
    EmployeeDeduct.findByIdAndRemove(id2, (err) => {
        req.flash('danger', 'Deduction deleted successfully.');
        res.redirect('/company/view_employee/' + id)
    })
}
const delete_benefit = (req, res) => {
    const id = req.params.id
    const id2 = req.params.id2
    EmployeeBenefit.findByIdAndRemove(id2, (err) => {
        req.flash('danger', 'Benefit deleted successfully.');
        res.redirect('/company/view_employee/' + id)
    })
}

const activate_loan = (req, res) => {
    const id = req.params.id
    const id2 = req.params.id2
    let query = {
        _id: id2
    }
    let data = {};
    data.status = 'Active'
    EmployeeLoan.update(query, data, (err) => {
        req.flash('info', 'Loan activated.');
        res.redirect('/company/view_employee/' + id)
    })

}
const activate_deduct = (req, res) => {
    const id = req.params.id
    const id2 = req.params.id2
    let query = {
        _id: id2
    }
    let data = {};
    data.status = 'Active'
    EmployeeDeduct.update(query, data, (err) => {
        req.flash('info', 'Deduction activated.');
        res.redirect('/company/view_employee/' + id)
    })
}
const activate_benefit = (req, res) => {
    const id = req.params.id
    const id2 = req.params.id2
    let query = {
        _id: id2
    }
    let data = {};
    data.status = 'Active'
    EmployeeBenefit.update(query, data, (err) => {
        req.flash('info', 'Benefit activated.');
        res.redirect('/company/view_employee/' + id)
    })
}

const deactivate_loan = (req, res) => {
    const id = req.params.id
    const id2 = req.params.id2
    let query = {
        _id: id2
    }
    let data = {};
    data.status = 'Inactive'
    EmployeeLoan.update(query, data, (err) => {
        req.flash('danger', 'Loan deactivated.');
        res.redirect('/company/view_employee/' + id)
    })
}
const deactivate_deduct = (req, res) => {
    const id = req.params.id
    const id2 = req.params.id2
    let query = {
        _id: id2
    }
    let data = {};
    data.status = 'Inactive'
    EmployeeDeduct.update(query, data, (err) => {
        req.flash('info', 'Deduction deactivated.');
        res.redirect('/company/view_employee/' + id)
    })
}
const deactivate_benefit = (req, res) => {
    const id = req.params.id
    const id2 = req.params.id2
    let query = {
        _id: id2
    }
    let data = {};
    data.status = 'Inactive'
    EmployeeBenefit.update(query, data, (err) => {
        req.flash('info', 'Benefit deactivated.');
        res.redirect('/company/view_employee/' + id)
    })
}

const activate_employee = (req, res) => {
    const id = req.params.id
    let query = {
        _id: id
    }
    let data = {};
    data.status = 'Active';
    Employee.update(query, data, (err) => {
        req.flash('info', 'Employee activated.');
        res.redirect('/company/view_employee/' + id)

    })

}
const terminate_employee = (req, res) => {
    const id = req.params.id;
    let query = {
        _id: id
    }
    let data = {};
    data.status = 'Terminated';
    Employee.update(query, data, (err) => {
        req.flash('danger', 'Employee terminated.');
        res.redirect('/company/view_employee/' + id)

    })
}

const activate_expense = (req, res) => {
    const id = req.params.id;
    const id2 = req.params.id2
    let query = {
        _id: id2
    }
    let data = {};
    data.status = 'Active'
    AppliedExpense.update(query, data, (err) => {
        req.flash('info', 'Expense accepted.');
        res.redirect('/company/view_employee/' + id)
    })

}

const decline_expense = (req, res) => {
    const id = req.params.id;
    const id2 = req.params.id2
    let query = {
        _id: id2
    }
    let data = {};
    data.status = 'Declined'
    AppliedExpense.update(query, data, (err) => {
        req.flash('danger', 'Expense declined.');
        res.redirect('/company/view_employee/' + id)

    })


}

const accept_exemption = (req, res) => {

    const id = req.params.id;
    Employee.findById(id, (err, employee) => {

        let query = {
            _id: employee.id
        }
        let data = {};
        let obj = employee.salary_details;
        obj.tax_exemption.approval = true;
        data.salary_details = obj
        Employee.update(query, data, (err) => {
            req.flash('info', 'Tax exemption approved successfully.')
            res.redirect('/company/view_employee/' + id)
        })
    })

}

const decline_exemption = (req, res) => {

    const id = req.params.id;
    Employee.findById(id, (err, employee) => {

        let query = {
            _id: employee.id
        }
        let data = {};
        let obj = employee.salary_details;
        obj.tax_exemption.approval = false;
        data.salary_details = obj
        Employee.update(query, data, (err) => {
            req.flash('danger', 'Tax exemption has been declined.')
            res.redirect('/company/view_employee/' + id)
        })
    })

}


const edit_employee = (req, res) => {
    Company.findById(req.user.company_id, (err, company) => {

        if (!company.enabled) {
            req.flash('danger', 'License has expired. Please contact the administrator for renewal: Email: ' + process.env.EMAIL)
            res.redirect('/company/validate_license')
        }
        else {
            const id = req.params.id;
            Employee.findById(id, (err, employee) => {
                Employee.find({ company_id: req.user.company_id }, (err, employees) => {
                    Job.find({ company_id: req.user.company_id }, (err, jobs) => {
                        Employee.find({ manager: true, company_id: req.user.company_id }, (err, managers) => {
                            Department.find({ company_id: req.user.company_id }, (err, departments) => {
                                Region.find({ company_id: req.user.company_id }, (err, regions) => {
                                    Shift.find({ company_id: req.user.company_id }, (err, shifts) => {
                                        Subsidiary.find({ company_id: req.user.company_id }, (err, companies) => {
                                            Bank.find({}, (err, banks) => {
                                                AppliedLeave.find({ company_id: req.user.company_id, status: 'Pending' }, (err, leaves2) => {
                                                    AppliedExpense.find({ company_id: req.user.company_id, status: 'Pending' }, (err, expenses2) => {

                                                        res.render('./company/employee/edit_employee.jade', {
                                                            user: req.user,
                                                            employees: employees,
                                                            jobs: jobs,
                                                            departments: departments,
                                                            regions: regions,
                                                            shifts: shifts,
                                                            company: company,
                                                            companies: companies,
                                                            leaves2: leaves2,
                                                            expenses2: expenses2,

                                                            banks: banks,
                                                            managers: managers,
                                                            employee: employee
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


const add_mobile_details = (req, res) => {
    let id = req.params.id;
    let { mobile_network, mobile_number } = req.body
    Employee.findById(id, (err, employee) => {
        console.log(employee)
        const arr = employee.salary_details.bank_details;
        if (arr.length < 1) {
            let query = {
                _id: id
            }
            let data = {}
            const salary_details = employee.salary_details;
            let obj = [{
                no: salary_details.bank_details.length + 1,
                mobile_network: mobile_network,
                mobile_number: mobile_number,
                status: 'Primary',
                type: 'Mobile Money'
            }]

            salary_details.payment_type = 'Mobile Money'
            salary_details.bank_details = employee.salary_details.bank_details.concat(obj)
            data.salary_details = salary_details
            Employee.update(query, data, (err) => {
                req.flash('info', 'Mobile payment details added successfully.')
                res.redirect('/company/view_employee/' + id)
            })

        }
        else if (arr.length > 0) {
            let filterPayment = arr.filter((item) => {
                return item.mobile_number === mobile_number
            })
            if (filterPayment.length > 0) {
                req.flash('danger', 'Mobile Number already exists.')
                res.redirect('/company/view_employee/' + id)
            }
            else if (filterPayment.length < 1) {
                let query = {
                    _id: id
                }
                let data = {}
                const salary_details = employee.salary_details;
                let obj = [{
                    no: salary_details.bank_details.length + 1,
                    mobile_network: mobile_network,
                    mobile_number: mobile_number,
                    status: '',
                    type: 'Mobile Money'
                }]
                salary_details.bank_details = employee.salary_details.bank_details.concat(obj)
                data.salary_details = salary_details
                Employee.update(query, data, (err) => {
                    req.flash('info', 'Mobile Payment details added successfully.')
                    res.redirect('/company/view_employee/' + id)
                })

            }
        }
    })



}
const add_bank_details = (req, res) => {
    let id = req.params.id;
    let { bank_account_name, bank_account_no, bank_name, bank_branch_code, bank_branch } = req.body;

    Employee.findById(id, (err, employee) => {
        let arr = employee.salary_details.bank_details;
        console.log(arr)
        if (arr.length < 1) {
            let query = {
                _id: id
            }
            const salary_details = employee.salary_details;
            let obj = [{
                no: salary_details.bank_details.length + 1,
                bank_account_no: bank_account_no,
                bank_account_name: bank_account_name,
                bank_name: bank_name,
                bank_branch_code: bank_branch_code,
                bank_branch: bank_branch,
                status: 'Primary',
                type: 'Bank Transfer'
            }]
            let data = {};
            salary_details.payment_type = 'Bank Transfer'
            salary_details.bank_details = employee.salary_details.bank_details.concat(obj)
            data.salary_details = salary_details
            Employee.update(query, data, (err) => {
                req.flash('info', 'Bank details added successfully.');
                res.redirect('/company/view_employee/' + id)
            })
        }
        else if (arr.length > 0) {
            const filterPayment = arr.filter((item) => {
                return item.bank_account_no === bank_account_no
            })
            console.log(filterPayment)
            if (filterPayment.length > 0) {
                req.flash('danger', 'Bank account number already exists.');
                res.redirect('/company/view_employee/' + id)
            }
            else if (filterPayment.length < 1) {
                let query = {
                    _id: id
                }
                const salary_details = employee.salary_details;
                let obj = [{
                    no: salary_details.bank_details.length + 1,
                    bank_account_no: bank_account_no,
                    bank_account_name: bank_account_name,
                    bank_name: bank_name,
                    bank_branch_code: bank_branch_code,
                    bank_branch: bank_branch,
                    status: '',
                    type: 'Bank Transfer'
                }]
                let data = {};

                salary_details.bank_details = employee.salary_details.bank_details.concat(obj)
                data.salary_details = salary_details
                Employee.update(query, data, (err) => {
                    req.flash('info', 'Bank details added successfully.');
                    res.redirect('/company/view_employee/' + id)
                })
            }
        }
    })

}

const delete_payment = (req, res) => {
    const id = req.params.id;

    Employee.findById(id, (err, employee) => {
        const salary_details = employee.salary_details
        const filter = salary_details.bank_details.filter((item) => {
            return parseInt(item.no) !== parseInt(req.params.no)
        })
        const query = {
            _id: id
        }
        let data = {};
        salary_details.payment_type = '';
        salary_details.bank_details = filter
        data.salary_details = salary_details
        Employee.update(query, data, () => {
            req.flash('danger', 'Payment details deleted successfully.');
            res.redirect('/company/view_employee/' + id)
        })
    })





}
const make_primary = (req, res) => {
    const id = req.params.id
    const no = req.params.no
    Employee.findById(id, (err, employee) => {
        let salary_details = employee.salary_details;
        let get_no = salary_details.bank_details.filter((item) => {
            return parseInt(item.no) === parseInt(no)
        })
        get_no[0].status = 'Primary';
        console.log(get_no[0].type)
        salary_details.payment_type = get_no[0].type;
        let filter = salary_details.bank_details.filter((item) => {
            return parseInt(item.no) !== parseInt(no)
        })
        filter[0].status = ''
        const new_array = filter.concat(get_no)
        salary_details.bank_details = new_array
        let query = {
            _id: id
        }
        let data = {};
        data.salary_details = salary_details;
        Employee.update(query, data, () => {
            req.flash('info', 'Payment details updated successfully.');
            res.redirect('/company/view_employee/' + id)
        })


    })


}

const add_employee_relief = (req, res) => {
    const { type, amount, policy, name_of_insurance_company, pin_of_insurance_company, sum_assured, monthly_premium_payable, maturity_period } = req.body;
    EmployeeRelief.findOne({ title: type, employee_id: req.params.id }, (err, relief) => {
        if (relief) {
            req.flash('danger', 'Relief already exists.');
            res.redirect('/company/view_employee/' + req.params.id)
        }
        else {
            Company.findById(req.user.company_id, (err, company) => {
                Relief.findOne({ item: type, company_id: req.user.company_id }, (err, relief) => {
                    console.log(relief)
                    if (type === 'Mortgage Relief') {

                        if (parseInt(amount) > parseInt(relief.maximum_amount)) {
                            req.flash('danger', "Total amount can't exceed " + company.currency + ' ' + relief.maximum_amount + ' for mortgage relief.')
                            res.redirect('/company/view_employee/' + req.params.id)

                        }
                        else {
                            let data = new EmployeeRelief({
                                title: type,
                                employee_id: req.params.id,
                                company_id: req.user.company_id,
                                amount: amount,
                                status: 'Active'
                            })
                            data.save(() => {
                                req.flash('info', 'Relief added successfully.');
                                res.redirect('/company/view_employee/' + req.params.id)
                            })
                        }
                    }
                    else if (type === 'Insurance Relief') {
                        if (policy === '') {
                            req.flash('danger', 'Insurance policy is required.');
                            res.redirect('/company/view_employee/' + req.params.id)
                        }
                        else if (name_of_insurance_company === '') {
                            req.flash('danger', 'Name of insurance company is required.');
                            res.redirect('/company/view_employee/' + req.params.id)

                        }
                        else if (pin_of_insurance_company === '') {
                            req.flash('danger', 'Pin of insurance company is required.');
                            res.redirect('/company/view_employee/' + req.params.id)
                        }
                        else if (parseInt(sum_assured) < 1) {
                            req.flash('danger', 'Sum assured is required.');
                            res.redirect('/company/view_employee/' + req.params.id)
                        }
                        else if (parseInt(monthly_premium_payable) < 1) {
                            req.flash('danger', 'Monthly premum payable amount is required.');
                            res.redirect('/company/view_employee/' + req.params.id)

                        }
                        else if (parseInt(maturity_period) < 1) {
                            req.flash('danger', 'Maturity period is required.');
                            res.redirect('/company/view_employee/' + req.params.id)
                        }
                        else {
                            let amount = 0;
                            if (policy === 'Education Insurance') {
                                if (parseInt(maturity_period) >= 10) {
                                    amount = parseInt(monthly_premium_payable) * (parseInt(relief.amount) / 100)
                                    if (parseInt(amount * 12) < relief.maximum_amount) {
                                        let data = new EmployeeRelief({
                                            title: type,
                                            employee_id: req.params.id,
                                            company_id: req.user.company_id,
                                            amount: amount,
                                            status: 'Active',
                                            insurance_relief_details: {
                                                policy: policy,
                                                name_of_insurance_company: name_of_insurance_company,
                                                pin_of_insurance_company: pin_of_insurance_company,
                                                sum_assured: sum_assured,
                                                monthly_premium_payable: monthly_premium_payable,
                                                maturity_period: maturity_period
                                            }
                                        })
                                        data.save(() => {
                                            req.flash('info', 'Relief added successfully.');
                                            res.redirect('/company/view_employee/' + req.params.id)
                                        })
                                    }
                                    else {
                                        req.flash('danger', "Relief amount can't exceed the annually maximum amount of " + company.currency + " " + relief.maximum_amount);
                                        res.redirect('/company/view_employee/' + req.params.id)
                                    }
                                }
                                else {
                                    req.flash('danger', "Maturity period should exceed at least ten years for Education Insurance.");
                                    res.redirect('/company/view_employee/' + req.params.id)

                                }
                            }
                            else if (policy !== 'Education Insurance') {
                                amount = parseInt(monthly_premium_payable) * (parseInt(relief.amount) / 100)

                                if (parseInt(amount * 12) < relief.maximum_amount) {
                                    let data = new EmployeeRelief({
                                        title: type,
                                        employee_id: req.params.id,
                                        company_id: req.user.company_id,
                                        amount: amount,
                                        status: 'Active',
                                        insurance_relief_details: {
                                            policy: policy,
                                            name_of_insurance_company: name_of_insurance_company,
                                            pin_of_insurance_company: pin_of_insurance_company,
                                            sum_assured: sum_assured,
                                            monthly_premium_payable: monthly_premium_payable,
                                            maturity_period: maturity_period
                                        }
                                    })
                                    data.save(() => {
                                        req.flash('info', 'Relief added successfully.');
                                        res.redirect('/company/view_employee/' + req.params.id)
                                    })
                                }
                                else {
                                    req.flash('danger', "Relief amount can't exceed the annually maximum amount of " + company.currency + " " + relief.maximum_amount);
                                    res.redirect('/company/view_employee/' + req.params.id)
                                }
                            }



                        }



                    }
                    else if (type === 'Personal Relief') {
                        let data = new EmployeeRelief({
                            title: type,
                            employee_id: req.params.id,
                            company_id: req.user.company_id,
                            amount: relief.amount,
                            status: 'Active'
                        })
                        data.save(() => {
                            req.flash('info', 'Relief added successfully.');
                            res.redirect('/company/view_employee/' + req.params.id)
                        })
                    }
                    else {
                        let data = new EmployeeRelief({
                            title: type,
                            employee_id: req.params.id,
                            company_id: req.user.company_id,
                            amount: amount,
                            status: 'Active'
                        })
                        data.save(() => {
                            req.flash('info', 'Relief added successfully.');
                            res.redirect('/company/view_employee/' + req.params.id)
                        })
                    }
                })
            })



        }
    })

}

const edit_employee_salary = (req, res) => {
    const id = req.params.id;
    const { salary } = req.body;
    Employee.findById(id, (err, employee) => {
        Pension.findOne({ company_id: req.user.company_id }, (err, pension) => {
            const salary_details = employee.salary_details;
            salary_details.salary_history.map((item) => {
                item.status = ''
            })
            let obj = [{
                salary: salary,
                salary_type: salary_details.salary_type,
                payment_currency: salary_details.payment_currency,
                status: 'Current',
                added_on: date.today
            }]
            salary_details.salary = salary;

            salary_details.salary_history = salary_details.salary_history.concat(obj)
            Deduction.findOne({ title: 'NHIF', company_id: req.user.company_id }, (err, deduction) => {
                Rate.find({ deduct_id: deduction.id }, (err, rates) => {

                    if (rates.length > 0) {
    
                        if (employee.salary_details.salary_type === 'Monthly') {
                            rates.map((item) => {
                                if (parseInt(employee.salary_details.salary) >= parseInt(item.minimum_amount) && parseInt(employee.salary_details.salary) < parseInt(item.maximum_amount)) {
    
                                    EmployeeDeduct.findOne({ type: 'NHIF', employee_id: id, company_id: req.user.company_id }, (err, ded) => {
                                        if (ded) {
                                            let query = {
                                                _id: ded.id
                                            }
                                            const data = {}
                                            data.amount = item.amount
                                            EmployeeDeduct.update(query, data, () => {
    
                                            })
    
                                        }
                                    })
    
                                }
    
                            })
    
                        }
    
                    }
    
    
                })

            })
          

            let query = {
                _id: id
            }

            let data = {};
            if (employee.pension === true) {
                data.pension_amount = parseInt((salary * pension.employee_percentage) / 100)

            }

            data.salary_details = salary_details;
            Employee.update(query, data, (err) => {
                req.flash('info', 'Salary updated successfully.');
                res.redirect('/company/view_employee/' + id)
            })
        })

    })
}

const suspension = (req, res) => {
    let { salary, start_date, end_date, duration } = req.body;
    Employee.findById(req.params.id, (err, employee) => {
        Pension.findOne({ company_id: req.user.company_id }, (err, pension) => {

            const new_salary = parseInt(employee.salary_details.salary) - parseInt(salary)
            const obj = [{
                salary: salary,
                start_date: start_date,
                end_date: end_date,
                duration: duration
            }]


            const salary_details = employee.salary_details;
            salary_details.salary_history.map((item) => {
                item.status = ''
            })
            let obj1 = [{
                salary: new_salary,
                salary_type: salary_details.salary_type,
                payment_currency: salary_details.payment_currency,
                status: 'Current',
                added_on: date.today
            }]
            salary_details.salary_history = salary_details.salary_history.concat(obj1)
            salary_details.salary = new_salary

            Deduction.findOne({ title: 'NHIF', company_id: req.user.company_id }, (err, deduction) => {
                Rate.find({ deduct_id: deduction.id }, (err, rates) => {

                    if (rates.length > 0) {
    
                        if (employee.salary_details.salary_type === 'Monthly') {
                            rates.map((item) => {
                                if (parseInt(new_salary) >= parseInt(item.minimum_amount) && parseInt(new_salary) < parseInt(item.maximum_amount)) {
    
                                    EmployeeDeduct.findOne({ type: 'NHIF', employee_id: id, company_id: req.user.company_id }, (err, ded) => {
                                        if (ded) {
                                            let query = {
                                                _id: ded.id
                                            }
                                            const data = {}
                                            data.amount = item.amount
                                            EmployeeDeduct.update(query, data, () => {
    
                                            })
    
                                        }
                                    })
    
                                }
    
                            })
    
                        }
    
                    }
    
    
                })

            })
              

            let query = {
                _id: req.params.id
            }
            let data = {};
            data.salary_details = salary_details;
            data.status = 'Suspended'
            if (employee.pension === true) {
                data.pension_amount = parseInt((new_salary * pension.employee_percentage) / 100)

            }

            data.suspension_details = employee.suspension_details.concat(obj);
            Employee.update(query, data, (err) => {
                req.flash('danger', 'Employee has been suspended.')
                res.redirect('/company/view_employee/' + req.params.id)
            })

        })
    })
}

const get_pension = (req, res) => {
    const number = parseInt(req.params.no)
    Pension.findOne({ company_id: req.user.company_id }, (err, pension) => {
        let amount = (number * pension.employee_percentage) / 100;
        if (amount > parseInt(pension.maximum_amount)) {
            res.send({ success: true, amount: parseInt(pension.maximum_amount) })
        }
        else if (amount < parseInt(pension.maximum_amount)) {
            res.send({ success: true, amount: parseInt(amount) })
        }

    })

}

// MODULE EXPORTED
module.exports = {
    get_pension: get_pension,
    suspension: suspension,
    edit_employee_post: edit_employee_post,
    edit_employee_salary: edit_employee_salary,
    delete_payment: delete_payment,
    make_primary: make_primary,
    add_bank_details: add_bank_details,
    add_mobile_details: add_mobile_details,
    employee_page: employee_page,
    add_new_employee: add_new_employee,
    activate_expense: activate_expense,
    decline_expense: decline_expense,
    add_new_employee_post: add_new_employee_post,

    view_employee: view_employee,
    delete_employee: delete_employee,
    add_employee_benefit: add_employee_benefit,
    add_employee_deduction: add_employee_deduction,
    add_employee_loan: add_employee_loan,
    delete_loan: delete_loan,
    delete_deduct: delete_deduct,
    delete_benefit: delete_benefit,
    activate_benefit: activate_benefit,
    activate_deduct: activate_deduct,
    activate_loan: activate_loan,
    deactivate_benefit: deactivate_benefit,
    deactivate_deduct: deactivate_deduct,
    deactivate_loan: deactivate_loan,
    activate_employee: activate_employee,
    terminate_employee: terminate_employee,
    accept_exemption: accept_exemption,
    decline_exemption: decline_exemption,
    edit_employee: edit_employee,
    delete_relief: delete_relief,
    activate_relief: activate_relief,
    deactivate_relief: deactivate_relief,
    add_employee_relief: add_employee_relief

}