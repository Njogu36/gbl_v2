// LIBRARIES


// IMPORTED FUNCTIONS


// MODELS
const Employee = require('../models/employee')
const Pay = require('../models/pay')
const Loan = require('../models/loan')
const Deduct = require('../models/deduction')
const Company = require('../models/company')
const AppliedLeave = require('../models/applied_leave')
const AppliedExpense = require('../models/applied_expense')
const EmployerSummary = require('../models/employer_summary')
const EmployeeSummary = require('../models/employee_summary')


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

// FUNCTIONS
const report_page = (req, res) => {
    Company.findById(req.user.company_id, (err, company) => {

        if (!company.enabled) {
            req.flash('danger', 'License has expired. Please contact the administrator for renewal: Email: ' + process.env.EMAIL)
            res.redirect('/company/validate_license')
        } else {
            Employee.find({
                company_id: req.user.company_id
            }, (err, employees) => {
                Pay.find({
                    status: 'Confirmed',
                    company_id: req.user.company_id
                }, (err, pays) => {
                    Loan.find({
                        company_id: req.user.company_id
                    }, (err, loans) => {

                        Deduct.find({
                            company_id: req.user.company_id
                        }, (er, deducts) => {
                            AppliedLeave.find({
                                company_id: req.user.company_id,
                                status: 'Pending'
                            }, (err, leaves2) => {
                                AppliedExpense.find({
                                    company_id: req.user.company_id,
                                    status: 'Pending'
                                }, (err, expenses2) => {

                                    res.render('./company/reports/report.jade', {
                                        user: req.user,
                                        employees: employees,
                                        pays: pays,
                                        company: company,
                                        loans: loans,
                                        expenses2: expenses2,
                                        leaves2: leaves2,
                                        deducts: deducts,
                                        table: 0
                                    })
                                })
                            })
                        })
                    })

                }).sort({
                    _id: -1
                })

            })


        }
    })

}


const nhif_report = (req, res) => {
    Company.findById(req.user.company_id, (err, company) => {

        if (!company.enabled) {
            req.flash('danger', 'License has expired. Please contact the administrator for renewal: Email: ' + process.env.EMAIL)
            res.redirect('/company/validate_license')
        } else {
            Employee.find({
                company_id: req.user.company_id
            }, (err, employees) => {
                Pay.find({
                    company_id: req.user.company_id,
                    status: 'Confirmed',
                    month2: month2
                }, (err, pays) => {
                    Loan.find({
                        company_id: req.user.company_id
                    }, (err, loans) => {
                        Deduct.find({
                            company_id: req.user.company_id
                        }, (er, deducts) => {
                            AppliedExpense.find({
                                company_id: req.user.company_id,
                                status: 'Pending'
                            }, (err, expenses2) => {
                                AppliedLeave.find({
                                    company_id: req.user.company_id,
                                    status: 'Pending'
                                }, (err, leaves2) => {

                                    let arr = [];
                                    if (pays.length > 0) {
                                        pays.map((item) => {
                                            item.deduction_details.map((item2) => {
                                                if (item2.type === 'NHIF') {
                                                    let obj = {
                                                        pay: item,
                                                        deduct: item2,
                                                        employee: item.emp,
                                                        amount: item2.amount
                                                    }
                                                    arr.push(obj)
                                                }

                                            })
                                        })
                                    }




                                    setTimeout(() => {
                                        console.log(month2)
                                        res.render('./company/reports/nhif_report.jade', {
                                            user: req.user,
                                            employees: employees,
                                            pays: pays,
                                            loans: loans,
                                            deducts: deducts,
                                            company: company,
                                            leaves2: leaves2,
                                            expenses2: expenses2,
                                            arr: arr,
                                            month: month2


                                        })
                                    }, 3500)
                                })
                            })
                        })
                    })
                }).sort({
                    _id: -1
                })
            })
        }
    })
}

const nhif_month = (req, res) => {

    Company.findById(req.user.company_id, (err, company) => {

        if (!company.enabled) {
            req.flash('danger', 'License has expired. Please contact the administrator for renewal: Email: ' + process.env.EMAIL)
            res.redirect('/company/validate_license')
        } else {
            Employee.find({
                company_id: req.user.company_id
            }, (err, employees) => {
                Pay.find({
                    company_id: req.user.company_id,
                    status: 'Confirmed',
                    month2: req.body.mm
                }, (err, pays) => {
                    Loan.find({
                        company_id: req.user.company_id
                    }, (err, loans) => {
                        Deduct.find({
                            company_id: req.user.company_id
                        }, (er, deducts) => {
                            AppliedExpense.find({
                                company_id: req.user.company_id,
                                status: 'Pending'
                            }, (err, expenses2) => {
                                AppliedLeave.find({
                                    company_id: req.user.company_id,
                                    status: 'Pending'
                                }, (err, leaves2) => {

                                    let arr = [];
                                    if (pays.length > 0) {
                                        pays.map((item) => {
                                            item.deduction_details.map((item2) => {
                                                if (item2.type === 'NHIF') {
                                                    let obj = {
                                                        pay: item,
                                                        deduct: item2,
                                                        employee: item.emp,
                                                        amount: item2.amount
                                                    }
                                                    arr.push(obj)
                                                }

                                            })
                                        })
                                    }




                                    setTimeout(() => {

                                        res.render('./company/reports/nhif_report.jade', {
                                            user: req.user,
                                            employees: employees,
                                            pays: pays,
                                            loans: loans,
                                            deducts: deducts,
                                            company: company,
                                            leaves2: leaves2,
                                            expenses2: expenses2,
                                            arr: arr,
                                            month: req.body.mm


                                        })
                                    }, 3500)
                                })
                            })
                        })
                    })
                }).sort({
                    _id: -1
                })
            })
        }
    })

}




const nssf_report = (req, res) => {

    Company.findById(req.user.company_id, (err, company) => {

        if (!company.enabled) {
            req.flash('danger', 'License has expired. Please contact the administrator for renewal: Email: ' + process.env.EMAIL)
            res.redirect('/company/validate_license')
        } else {
            Employee.find({
                company_id: req.user.company_id
            }, (err, employees) => {
                Pay.find({
                    company_id: req.user.company_id,
                    status: 'Confirmed',
                    month2: month2
                }, (err, pays) => {
                    Loan.find({
                        company_id: req.user.company_id
                    }, (err, loans) => {
                        Deduct.find({
                            company_id: req.user.company_id
                        }, (er, deducts) => {
                            AppliedExpense.find({
                                company_id: req.user.company_id,
                                status: 'Pending'
                            }, (err, expenses2) => {
                                AppliedLeave.find({
                                    company_id: req.user.company_id,
                                    status: 'Pending'
                                }, (err, leaves2) => {

                                    let arr = [];
                                    pays.map((item) => {
                                        item.deduction_details.map((item2) => {
                                            if (item2.type === 'NSSF') {
                                                let obj = {
                                                    pay: item,
                                                    deduct: item2,
                                                    employee: item.emp,
                                                    amount: item2.amount
                                                }
                                                arr.push(obj)
                                            }

                                        })
                                    })

                                    setTimeout(() => {

                                        res.render('./company/reports/nssf_report.jade', {
                                            user: req.user,
                                            employees: employees,
                                            pays: pays,
                                            loans: loans,
                                            deducts: deducts,
                                            company: company,
                                            leaves2: leaves2,
                                            expenses2: expenses2,
                                            arr: arr,

                                        })
                                    }, 3500)
                                })
                            })
                        })
                    })
                }).sort({
                    _id: -1
                })
            })
        }
    })
}

const nssf_month = (req, res) => {


    Company.findById(req.user.company_id, (err, company) => {

        if (!company.enabled) {
            req.flash('danger', 'License has expired. Please contact the administrator for renewal: Email: ' + process.env.EMAIL)
            res.redirect('/company/validate_license')
        } else {
            Employee.find({
                company_id: req.user.company_id
            }, (err, employees) => {
                Pay.find({
                    company_id: req.user.company_id,
                    status: 'Confirmed',
                    month2: req.body.month
                }, (err, pays) => {
                    Loan.find({
                        company_id: req.user.company_id
                    }, (err, loans) => {
                        Deduct.find({
                            company_id: req.user.company_id
                        }, (er, deducts) => {
                            AppliedExpense.find({
                                company_id: req.user.company_id,
                                status: 'Pending'
                            }, (err, expenses2) => {
                                AppliedLeave.find({
                                    company_id: req.user.company_id,
                                    status: 'Pending'
                                }, (err, leaves2) => {

                                    let arr = [];
                                    pays.map((item) => {
                                        item.deduction_details.map((item2) => {
                                            if (item2.type === 'NSSF') {
                                                let obj = {
                                                    pay: item,
                                                    deduct: item2,
                                                    employee: item.emp,
                                                    amount: item2.amount
                                                }
                                                arr.push(obj)
                                            }

                                        })
                                    })

                                    setTimeout(() => {

                                        res.render('./company/reports/nssf_report.jade', {
                                            user: req.user,
                                            employees: employees,
                                            pays: pays,
                                            loans: loans,
                                            deducts: deducts,
                                            company: company,
                                            leaves2: leaves2,
                                            expenses2: expenses2,
                                            arr: arr,

                                        })
                                    }, 3500)
                                })
                            })
                        })
                    })
                }).sort({
                    _id: -1
                })
            })
        }
    })
}



const employees_report = (req, res) => {
    Company.findById(req.user.company_id, (err, company) => {

        if (!company.enabled) {
            req.flash('danger', 'License has expired. Please contact the administrator for renewal: Email: ' + process.env.EMAIL)
            res.redirect('/company/validate_license')
        } else {
            Employee.find({
                company_id: req.user.company_id
            }, (err, employees) => {
                AppliedExpense.find({
                    company_id: req.user.company_id,
                    status: 'Pending'
                }, (err, expenses2) => {
                    AppliedLeave.find({
                        company_id: req.user.company_id,
                        status: 'Pending'
                    }, (err, leaves2) => {
                        EmployeeSummary.findOne({
                            no: 1,
                            company_id: req.user.company_id,
                            month2: month2
                        }, (err, summary) => {
                            Pay.find({
                                company_id: req.user.company_id,
                                status: 'Confirmed',
                                month2: month2
                            }, (err, pays) => {
                                console.log(req.user.company_id)
                                console.log(pays)
                                setTimeout(() => {
                                    res.render('./company/reports/employees_report.jade', {
                                        user: req.user,
                                        employees: employees,
                                        employee_summary: summary,
                                        company: company,
                                        leaves2: leaves2,
                                        expenses2: expenses2,
                                        pays: pays


                                    })
                                }, 3500)

                            }).sort({
                                _id: -1
                            })

                        })




                    })
                })

            })
        }
    })

}
const employers_report = (req, res) => {
    Company.findById(req.user.company_id, (err, company) => {

        if (!company.enabled) {
            req.flash('danger', 'License has expired. Please contact the administrator for renewal: Email: ' + process.env.EMAIL)
            res.redirect('/company/validate_license')
        } else {
            Employee.find({
                company_id: req.user.company_id
            }, (err, employees) => {
                AppliedExpense.find({
                    company_id: req.user.company_id,
                    status: 'Pending'
                }, (err, expenses2) => {
                    AppliedLeave.find({
                        company_id: req.user.company_id,
                        status: 'Pending'
                    }, (err, leaves2) => {

                        EmployerSummary.findOne({
                            no: 1,
                            company_id: req.user.company_id,
                            month2: month2,
                            approved: true
                        }, (err, summary) => {
                            setTimeout(() => {

                                res.render('./company/reports/employers_report.jade', {
                                    user: req.user,
                                    employees: employees,
                                    employer_summary: summary,
                                    company: company,
                                    leaves2: leaves2,
                                    expenses2: expenses2,
                                    month: month2


                                })
                            }, 3500)
                        })


                    })
                })

            })
        }
    })

}

const employers_month = (req, res) => {
    Company.findById(req.user.company_id, (err, company) => {

        if (!company.enabled) {
            req.flash('danger', 'License has expired. Please contact the administrator for renewal: Email: ' + process.env.EMAIL)
            res.redirect('/company/validate_license')
        } else {
            Employee.find({
                company_id: req.user.company_id
            }, (err, employees) => {
                AppliedExpense.find({
                    company_id: req.user.company_id,
                    status: 'Pending'
                }, (err, expenses2) => {
                    AppliedLeave.find({
                        company_id: req.user.company_id,
                        status: 'Pending'
                    }, (err, leaves2) => {

                        EmployerSummary.findOne({
                            no: 1,
                            company_id: req.user.company_id,
                            month2: req.body.mm,
                            approved: true
                        }, (err, summary) => {
                            setTimeout(() => {

                                res.render('./company/reports/employers_report.jade', {
                                    user: req.user,
                                    employees: employees,
                                    employer_summary: summary,
                                    company: company,
                                    leaves2: leaves2,
                                    expenses2: expenses2,
                                    month: req.body.mm


                                })
                            }, 3500)
                        })


                    })
                })

            })
        }
    })

}

const employee_month = (req, res) => {
    Company.findById(req.user.company_id, (err, company) => {

        if (!company.enabled) {
            req.flash('danger', 'License has expired. Please contact the administrator for renewal: Email: ' + process.env.EMAIL)
            res.redirect('/company/validate_license')
        } else {
            Employee.find({
                company_id: req.user.company_id
            }, (err, employees) => {
                AppliedExpense.find({
                    company_id: req.user.company_id,
                    status: 'Pending'
                }, (err, expenses2) => {
                    AppliedLeave.find({
                        company_id: req.user.company_id,
                        status: 'Pending'
                    }, (err, leaves2) => {
                        EmployeeSummary.findOne({
                            no: 1,
                            company_id: req.user.company_id,
                            month2: month2
                        }, (err, summary) => {
                            Pay.find({
                                company_id: req.user.company_id,
                                status: 'Confirmed',
                                month2: req.body.mm
                            }, (err, pays) => {
                                console.log(req.body.mm)
                                console.log(pays)
                                setTimeout(() => {
                                    res.render('./company/reports/employees_report.jade', {
                                        user: req.user,
                                        employees: employees,
                                        employee_summary: summary,
                                        company: company,
                                        leaves2: leaves2,
                                        expenses2: expenses2,
                                        pays: pays


                                    })
                                }, 3500)

                            }).sort({
                                _id: -1
                            })

                        })




                    })
                })

            })
        }
    })

}

const kra_report = (req, res) => {

    Company.findById(req.user.company_id, (err, company) => {

        if (!company.enabled) {
            req.flash('danger', 'License has expired. Please contact the administrator for renewal: Email: ' + process.env.EMAIL)
            res.redirect('/company/validate_license')
        } else {
            Employee.find({
                company_id: req.user.company_id
            }, (err, employees) => {
                Pay.find({
                    company_id: req.user.company_id,
                    status: 'Confirmed',
                    month2: month2
                }, (err, pays) => {

                    AppliedExpense.find({
                        company_id: req.user.company_id,
                        status: 'Pending'
                    }, (err, expenses2) => {
                        AppliedLeave.find({
                            company_id: req.user.company_id,
                            status: 'Pending'
                        }, (err, leaves2) => {

                            let array = []
                            
                            pays.map((item)=>{
                               
                                 
                                 if(item.car_benefit_details !== undefined)
                                 {
                                    let obj ={
                                        emp:{},
                                        car:{}
                                    }
                                     const ob = item.car_benefit_details;
                                     obj.emp=item.emp;
                                     obj.car =ob
                                     array.push(obj)

                                 }
                              
                            })
                        
                           

                            setTimeout(() => {
                                console.log(array)
                                res.render('./company/reports/kra_report.jade', {
                                    user: req.user,
                                    employees: employees,
                                    pays: pays,
                                   
                                    company: company,
                                    leaves2: leaves2,
                                    expenses2: expenses2,
                                    array:array
                                })
                            }, 3500)
                        })

                    })
                }).sort({
                    _id: -1
                })
            })
        }
    })

}

const kra_month = (req, res) => {

    Company.findById(req.user.company_id, (err, company) => {

        if (!company.enabled) {
            req.flash('danger', 'License has expired. Please contact the administrator for renewal: Email: ' + process.env.EMAIL)
            res.redirect('/company/validate_license')
        } else {
            Employee.find({
                company_id: req.user.company_id
            }, (err, employees) => {
                Pay.find({
                    company_id: req.user.company_id,
                    status: 'Confirmed',
                    month2: req.body.mm
                }, (err, pays) => {

                    AppliedExpense.find({
                        company_id: req.user.company_id,
                        status: 'Pending'
                    }, (err, expenses2) => {
                        AppliedLeave.find({
                            company_id: req.user.company_id,
                            status: 'Pending'
                        }, (err, leaves2) => {

                            let array = []
                            let obj ={
                                emp:{},
                                car:{}
                            }
                            pays.map((item)=>{
                               
                                 
                                 if(item.car_benefit_details !== undefined)
                                 {
                                     const ob = item.car_benefit_details;
                                     obj.emp=item.emp;
                                     obj.car =ob
                                     array.push(obj)

                                 }
                              
                            })
                        
                           

                            setTimeout(() => {
                                console.log(array)
                                res.render('./company/reports/kra_report.jade', {
                                    user: req.user,
                                    employees: employees,
                                    pays: pays,
                                   
                                    company: company,
                                    leaves2: leaves2,
                                    expenses2: expenses2,
                                    array:array
                                })
                            }, 3500)
                        })

                    })
                }).sort({
                    _id: -1
                })
            })
        }
    })

}


// MODULE EXPORTED
module.exports = {
    report_page: report_page,
    nhif_report: nhif_report,
    nhif_month: nhif_month,
    nssf_month: nssf_month,
    nssf_report: nssf_report,
    kra_report: kra_report,
    employees_report: employees_report,
    employers_report: employers_report,
   kra_month:kra_month,
    employers_month: employers_month,
    employee_month: employee_month

}