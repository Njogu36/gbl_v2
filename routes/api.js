const express = require('express');
const bcrypt = require('bcryptjs')
const router = express.Router();


// MODELS
const AdminCompany = require('../models/adminCompany');
const Casual = require('../models/casual')
const Company = require('../models/company')
const Employee = require('../models/employee');
const Department = require('../models/department')
const EmployeeRelief = require('../models/employee_relief')
const EmployeeDeduct = require('../models/employee_deduction')
const Setting = require('../models/casual_setting')
const DepartmentUser =require('../models/department_user')
const Attendance = require('../models/attendance');
const { mapReduce } = require('../models/adminCompany');


// DATE
const date = new Date();
const year = date.getFullYear();
const day = ('0' + date.getDate()).slice(-2);
const day3 = date.getDate();

const month = ('0' + (date.getMonth() + 1)).slice(-2);
const today = year + "-" + month + "-" + day;
const monthNo = date.getMonth()
const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];


router.get('/',(req,res)=>{
    res.send({message:'Success'})
})


// login
router.post('/user_login', (req, res) => {
    let { username, password } = req.body;
    console.log('connected')
    AdminCompany.findOne({ username: username }, (err, company) => {
        
        if (company) {

            bcrypt.compare(password, company.password, function (err, isMatch) {
                
                if (isMatch) {
                    res.send({ success: true,company:company })
                } else {

                    res.send({ success: false, message: 'Wrong Password.' })
                }
            });
        }
        else {
            res.send({ success: false, message: 'Invalid username.' })
        }
    })

})

router.post('/department_login', (req, res) => {
    let { email, password } = req.body;
    console.log('connected')
    DepartmentUser.findOne({ email: email }, (err, department) => {
        
        if (department) {

            bcrypt.compare(password, department.password, function (err, isMatch) {
                
                if (isMatch) {
                    res.send({ success: true,department:department })
                } else {

                    res.send({ success: false, message: 'Wrong Password.' })
                }
            });
        }
        else {
            res.send({ success: false, message: 'Invalid email.' })
        }
    })

})


// get_casual_employees
router.get('/get_casual_employees/:id', (req, res) => {
    const id = req.params.id
    Employee.find({employee_type:'Casual Employee',company_id:id,status:'Active'},(err,employees)=>{
        console.log(employees)
        Company.findById(id,(err,company)=>{
            if(employees.length<1)
            {
              res.send({success:false,message:'No employees found.'})
            }
            else if(employees.length>0)
            {
                res.send({success:true,employees:employees,company:company,today:today})
            }
        })
       

    })
})


// get_casuals_departments 
router.get('/get_departments/:id/:id2',(req,res)=>{
    console.log(req.params.id)
    Setting.findOne({no:1,company_id:req.params.id},(err,setting)=>{
        Department.find({ company_id: req.params.id,casual:true }, (err, departments) => {
            Attendance.find({company_id: req.params.id,employee_id:req.params.id2,date:today,approved:false},(err,attendances)=>{
                
                console.log(attendances)
                res.send({success:true,departments:attendances,setting:setting,today:today})
            })
     })
    })
  

})

// GET ATTENDANCE

router.get('/get_attendance/:name/:id/:id2',(req,res)=>{
    
    Setting.findOne({no:1,company_id:req.params.id},(err,setting)=>{
    Attendance.findOne({employee_id:req.params.id2,department:req.params.name,date:today,approved:false},(err,attendance)=>{
        Attendance.find({employee_id:req.params.id2,date:today,approved:false},(err,attendances)=>{
            let total_hours = 0
            attendances.map((item)=>{
                total_hours +=item.hours

            })
            
            setTimeout(()=>{
               console.log(setting)
                if(attendance)
                {
                   
                      res.send({success:true,attendance:attendance,today:today,setting:setting,total_hours:parseInt(total_hours)})
                }
                else
                {
                    res.send({success:false,today:today})
                }
            },1000)
       

    })
})
})

})

router.post('/add_attendance/:id/:id2',(req,res)=>{
    const {department,hours}=req.body
    Attendance.findOne({employee_id:req.params.id,department:department,date:today,approved:false},(err,attendance)=>{
        Employee.findById(req.params.id,(err,employee)=>{
            Attendance.find({employee_id:req.params.id,date:today,approved:false},(err,attendances)=>{
                Setting.findOne({no:1,company_id:req.params.id2},(err,setting)=>{


            if(attendance)
            {
                res.send({success:false,message:"Today's attendance already exists."})
            }
            else
            {
                let total_hours = 0
                attendances.map((item)=>{
                    total_hours +=item.hours
                })

                setTimeout(()=>{
                    const sum =  parseInt(total_hours) + parseInt(hours)
                    if(parseInt(total_hours) > parseInt(setting.hours))
                    {
                        res.send({success:false,message:'Employee has already spent the maximum daily hours.'})
                    }
                    else if(sum>parseInt(setting.hours))
                    {
                        res.send({success:false,message:"Total hours can't exceed maximum " + setting.hours + " hours."})
                    }
                    else
                    {
                        let data = new Attendance({
                            company_id:req.params.id2,
                            employee_id:req.params.id,
                            emp:employee,
                            department:department,
                            hours:parseInt(hours),
                            date:today,
                            approved:false
                          })
                          data.save(()=>{
                              res.send({success:true,message:'Attendance saved successfully.'})
                          })
                    }
                },1000)
               
           
              
            }
        })
    })
    })
       
     
    })

})

router.post('/update_attendance/:id/:id2',(req,res)=>{
    const {department,hours}=req.body
    Attendance.findOne({employee_id:req.params.id,department:department,date:today,approved:false},(err,attendance)=>{
        Employee.findById(req.params.id,(err,employee)=>{
            Attendance.find({employee_id:req.params.id,date:today,approved:false},(err,attendances)=>{
                Setting.findOne({no:1,company_id:req.params.id2},(err,setting)=>{


            if(attendance)
            {
                let total_hours = 0
                attendances.map((item)=>{
                    total_hours +=item.hours
                })

                setTimeout(()=>{
                    const sum =  parseInt(total_hours) + parseInt(hours)
                    if(parseInt(total_hours) > parseInt(setting.hours))
                    {
                        res.send({success:false,message:'Employee has already spent the maximum daily hours.'})
                    }
                    else if(sum>parseInt(setting.hours))
                    {
                        res.send({success:false,message:"Total hours can't exceed maximum " + setting.hours + " hours."})
                    }
                    else
                    {
                        let query = {
                            _id:attendance.id
                        }
                        let data = {}
                        data.hours = parseInt(hours)
                        Attendance.update(query,data,()=>{
                              res.send({success:true,message:'Attendance updated successfully.'})
                          })
                    }
                },1000)
               
           
              
            }
        })
    })
    })
       
     
    })

})

// add_casuals
router.post('/add_casual/:id/:id2', (req, res) => {
  
    var dated = new Date();
    var weekOfMonth = (0 | dated.getDate() / 7) + 1;
    var check = 0
    console.log(req.body.hours)

    let array = [['-']]
    let array2 = [['-']]
    let i
    function daysInMonth(month, year) {
        return new Date(year, month, 0).getDate();
    }
    const no_days = daysInMonth(month, year)

    for (i = 0; i <= no_days; i++) {

        if (i < no_days) {
            let arr = [
                {
                    week: 0,
                    sum: 0,
                    bonus: 0
                }
            ]
            let arr2 = []
            array.push(arr)
            array2.push(arr2)
        }

    }

    let hours_array = req.body.hours
    
    let max_hours = 0
    Setting.findOne({ no: 1, company_id: req.params.id2 }, (err, setting) => {
        max_hours = setting.hours
        if (day3 <= setting.mid_day) {
            check = 1
        }
        if (day3 > setting.mid_day) {
            check = 2
        }    
    })

    setTimeout(() => {
       
        if (parseInt(req.body.total_hours) > parseInt(max_hours)) {
           
            res.send({success:false,message:'Number of hours can exceed the maximum ' + max_hours + ' hours.'})
        }
        else if (parseInt(req.body.total_hours) === 0) {
            
            res.send({success:false,message:'Number of hours cannot be less than one.'})
     
        }

        else if ((parseInt(req.body.total_hours) <= parseInt(max_hours))) {

            let personal_relief = 0
            EmployeeRelief.find({ employee_id: req.params.id, status: 'Active', company_id: req.params.id2 }, (err, reliefs) => {
                const filter = reliefs.filter((item) => {
                    return item.title === 'Personal Relief'
                })
                if (filter.length > 0) {
                    personal_relief = filter[0].amount
                }

            })



            Employee.findById(req.params.id, (err, employee) => {
                console.log(employee)
                Casual.findOne({ month: monthNames[monthNo], year: year, employee_id: employee.id, company_id: req.params.id2 }, (err, casual) => {
                    if (casual) {
                        console.log(casual)

                        if (casual.data_amount[day3][0].sum !== 0) {
                           
                            res.send({success:false,message:'You have already added a payment today'})
     

                        }
                        if (casual.data_amount[day3][0].sum === 0) {
                            let sum = parseInt(employee.salary_details.salary)



                            let array = [
                                {
                                    week: weekOfMonth,
                                    sum: sum,
                                    bonus: parseInt(req.body.bonus)
                                }

                            ]

                            array2[day3] = hours_array
                            casual.data_amount[day3] = array
                            casual.data_hours[day3] = hours_array

                            let query = {
                                _id: casual.id
                            }
                            let data = {};
                            data.data_amount = casual.data_amount
                            data.data_hours = casual.data_hours
                            data.comments = casual.comment.concat( [{
                                comment:req.body.comment,
                                added_on:today,
                                bonus:req.body.bonus,
                                back_pay:req.body.back_pay
                            }])

                            data.ban = {
                                data: casual.data_amount
                            }



                            if (check === 1) {
                                const total_bonus = parseInt(casual.bonus_1st) + parseInt(req.body.bonus);
                                const back_pay = parseInt(casual.back_pay_1st) + parseInt(req.body.back_pay)

                                data.bonus_1st = total_bonus
                                data.back_pay_1st = back_pay
                            }
                            else if (check === 2) {
                                const total_bonus = parseInt(casual.bonus_2nd) + parseInt(req.body.bonus);
                                const back_pay = parseInt(casual.back_pay_2nd) + parseInt(req.body.back_pay)

                                data.bonus_2nd = total_bonus
                                data.back_pay_2nd = back_pay
                            }

                            Casual.update(query, data, (err) => {
                              
                                res.send({success:true,message:'Payment saved successfully.'})
                            })

                        }

                    }
                    else {
                        // RELIEF

                        let sum = parseInt(employee.salary_details.salary)
                        array[day3] = [
                            {
                                week: weekOfMonth,
                                sum: sum,
                                bonus: parseInt(req.body.bonus)
                            }

                        ]
                        
                        array2[day3] = hours_array
                        let data = new Casual()
                        data.company_id = req.params.id2,
                            data.employee_id = employee.id,
                            data.employee = employee,
                            data.amount = req.body.salary,
                            data.department = employee.department,

                            data.day = day3,
                            data.month = monthNames[monthNo],
                            data.year = year,
                            data.personal_relief = personal_relief,// gross amount
                            data.gross_amount_1st = 0,
                            data.gross_amount_2nd = 0,
                            data.total_month_gross = 0

                        if (check === 1) {
                            const total_bonus = parseInt(req.body.bonus);
                            const back_pay = parseInt(req.body.back_pay)

                            data.bonus_1st = total_bonus
                            data.back_pay_1st = back_pay
                            data.bonus_2nd = 0
                            data.back_pay_2nd = 0
                        }
                        else if (check === 2) {
                            const total_bonus = parseInt(req.body.bonus);
                            const back_pay = parseInt(req.body.back_pay)
                            data.bonus_1st = 0
                            data.back_pay_1st = 0
                            data.bonus_2nd = total_bonus
                            data.back_pay_2nd = back_pay
                        }

                        // nhif,nssf,nita
                           data.nhif_1st = 0,
                            data.nhif_2nd = 0,
                            data.nssf_1st = 0,
                            data.nssf_2nd = 0,
                            data.nita = 0,
                            data.nita2 = 0,
                            // Tax
                            data.tax_payable = 0,
                            data.tax_deducted = 0,

                            // net_amount
                            data.net_amount_1st = 0,
                            data.net_amount_2nd = 0,

                            data.second_half = false,
                            data.first_half = false,
                            data.data_amount = array,
                            data.data_hours = array2,
                            data.ban = {
                                data: array
                            },
                            data.created_on = new Date(),
                            data.date = req.body.date
                            if(req.body.comment !=='')
                            {
                                data.comments = [{
                                    comment:req.body.comment,
                                    added_on:today,
                                    bonus:req.body.bonus,
                                    back_pay:req.body.back_pay
                                }]
                            }
                            



                        data.save(() => {
                            Attendance.find({employee_id:req.params.id,approved:false,date:today},(err,attendances)=>{
                                attendances.map((item)=>{
                                    let query = {
                                        _id:item.id
                                    }
                                    let data = {};
                                    data.approved = true
                                    Attendance.update(query,data,(err)=>{
                                        res.send({success:true,message:'Payment saved successfully.'})
                                    })
                                })
                            })
                          
                        
                        
                        })

                    }
                })
            })
        }




    }, 1500)
          
})





module.exports = router;